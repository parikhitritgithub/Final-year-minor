from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import trimesh
import numpy as np
import time
import uuid
from typing import List, Dict
from scipy.spatial import cKDTree

app = FastAPI(title="3D Model Evaluation API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory history store
evaluation_history: List[Dict] = []

# =========================
# HELPER FUNCTIONS FOR CHAMFER DISTANCE
# =========================
def sample_points(mesh, n_points=5000):
    """Uniformly sample points from mesh surface."""
    points, _ = trimesh.sample.sample_surface(mesh, n_points)
    return points

def chamfer_distance(mesh1, mesh2, n_points=5000):
    """Symmetric Chamfer distance between two meshes."""
    pts1 = sample_points(mesh1, n_points)
    pts2 = sample_points(mesh2, n_points)
    tree1 = cKDTree(pts1)
    tree2 = cKDTree(pts2)
    d1 = tree2.query(pts1, k=1)[0].mean()
    d2 = tree1.query(pts2, k=1)[0].mean()
    return float(d1 + d2)

def load_mesh_from_file(file_obj, filename):
    """Load mesh from uploaded file (OBJ or GLB)."""
    file_obj.seek(0)
    if filename.lower().endswith('.obj'):
        mesh = trimesh.load(file_obj, file_type='obj')
    elif filename.lower().endswith(('.glb', '.gltf')):
        mesh = trimesh.load(file_obj, file_type='glb')
    else:
        return None
    if isinstance(mesh, trimesh.Scene):
        mesh = trimesh.util.concatenate(tuple(mesh.dump()))
    return mesh

# =========================
# IoU CALCULATION (existing)
# =========================
def calculate_iou(mesh):
    bounds = mesh.bounds
    bbox_volume = float(np.prod(bounds[1] - bounds[0]))
    mesh_volume = float(mesh.volume) if hasattr(mesh, 'volume') else 0.0
    intersection = min(bbox_volume, mesh_volume)
    union = bbox_volume + mesh_volume - intersection
    iou = intersection / union if union > 0 else 0.0
    return round(iou, 4)

# =========================
# DETAILED METRICS (existing)
# =========================
def evaluate_mesh(mesh):
    start_time = time.time()
    num_vertices = int(len(mesh.vertices))
    num_faces = int(len(mesh.faces))
    num_edges = int(len(mesh.edges))
    smoothness = float(mesh.area / num_faces) if num_faces > 0 else 0.0
    normals = mesh.vertex_normals
    normal_consistency = float(np.mean(np.abs(np.sum(normals[:-1] * normals[1:], axis=1))))
    bounds = mesh.bounds
    bbox_size = (bounds[1] - bounds[0]).tolist()
    bbox_volume = float(np.prod(bounds[1] - bounds[0]))
    surface_area = float(mesh.area)
    try:
        mesh_volume = float(mesh.volume)
    except Exception:
        mesh_volume = 0.0
    is_watertight = bool(mesh.is_watertight)
    edge_vectors = mesh.vertices[mesh.edges[:, 0]] - mesh.vertices[mesh.edges[:, 1]]
    edge_lengths = np.linalg.norm(edge_vectors, axis=1)
    avg_edge_length = float(np.mean(edge_lengths))
    min_edge_length = float(np.min(edge_lengths))
    max_edge_length = float(np.max(edge_lengths))
    edge_length_std = float(np.std(edge_lengths))
    face_areas = mesh.area_faces
    avg_face_area = float(np.mean(face_areas))
    min_face_area = float(np.min(face_areas))
    max_face_area = float(np.max(face_areas))
    face_area_std = float(np.std(face_areas))
    face_area_hist, face_area_bins = np.histogram(face_areas, bins=20)
    face_area_distribution = {"counts": face_area_hist.tolist(), "bin_edges": face_area_bins.tolist()}
    edge_length_hist, edge_length_bins = np.histogram(edge_lengths, bins=20)
    edge_length_distribution = {"counts": edge_length_hist.tolist(), "bin_edges": edge_length_bins.tolist()}
    if len(normals) > 1:
        dot_products = np.sum(normals[:-1] * normals[1:], axis=1)
        angles = np.degrees(np.arccos(np.clip(dot_products, -1, 1)))
        normal_angle_hist, normal_angle_bins = np.histogram(angles, bins=20)
        normal_angle_distribution = {"counts": normal_angle_hist.tolist(), "bin_edges": normal_angle_bins.tolist()}
        avg_normal_angle = float(np.mean(angles))
    else:
        normal_angle_distribution = {"counts": [], "bin_edges": []}
        avg_normal_angle = 0.0
    quality_score = compute_quality_score(normal_consistency, smoothness, is_watertight, edge_length_std, num_faces)
    iou_score = calculate_iou(mesh)
    latency = round(time.time() - start_time, 4)
    return {
        "id": str(uuid.uuid4())[:8],
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "vertices": num_vertices,
        "faces": num_faces,
        "edges": num_edges,
        "smoothness": round(smoothness, 6),
        "normal_consistency": round(normal_consistency, 4),
        "quality_score": quality_score,
        "iou_score": iou_score,
        "surface_area": round(surface_area, 4),
        "volume": round(mesh_volume, 4),
        "is_watertight": is_watertight,
        "bbox_size": [round(x, 4) for x in bbox_size],
        "bbox_volume": round(bbox_volume, 4),
        "avg_edge_length": round(avg_edge_length, 6),
        "min_edge_length": round(min_edge_length, 6),
        "max_edge_length": round(max_edge_length, 6),
        "edge_length_std": round(edge_length_std, 6),
        "avg_face_area": round(avg_face_area, 8),
        "min_face_area": round(min_face_area, 8),
        "max_face_area": round(max_face_area, 8),
        "face_area_std": round(face_area_std, 8),
        "avg_normal_angle": round(avg_normal_angle, 2),
        "face_area_distribution": face_area_distribution,
        "edge_length_distribution": edge_length_distribution,
        "normal_angle_distribution": normal_angle_distribution,
        "latency_seconds": latency,
    }

def compute_quality_score(normal_consistency, smoothness, is_watertight, edge_std, num_faces):
    score = 0.0
    score += min(normal_consistency, 1.0) * 40
    if smoothness <= 0.0001:
        score += 25
    elif smoothness <= 0.001:
        score += 20
    elif smoothness <= 0.01:
        score += 12
    else:
        score += 5
    if is_watertight:
        score += 15
    if edge_std <= 0.001:
        score += 10
    elif edge_std <= 0.01:
        score += 7
    else:
        score += 3
    if num_faces >= 100000:
        score += 10
    elif num_faces >= 10000:
        score += 7
    elif num_faces >= 1000:
        score += 4
    else:
        score += 2
    return min(round(score), 100)

# =========================
# ROUTES
# =========================
@app.post("/evaluate")
async def evaluate(file: UploadFile = File(...)):
    try:
        filename = file.filename.lower()
        if filename.endswith('.obj'):
            mesh = trimesh.load(file.file, file_type='obj')
        elif filename.endswith('.glb') or filename.endswith('.gltf'):
            mesh = trimesh.load(file.file, file_type='glb')
        else:
            return {"error": "Unsupported file format. Please upload .obj or .glb file."}
        if mesh is None or len(mesh.vertices) == 0:
            return {"error": "Failed to parse mesh or empty mesh."}
        metrics = evaluate_mesh(mesh)
        evaluation_history.append(metrics)
        return metrics
    except Exception as e:
        return {"error": str(e)}

@app.post("/compare")
async def compare_models(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """
    Compute Chamfer distance between two 3D models (OBJ or GLB).
    Returns: { "chamfer_distance": value }
    """
    try:
        mesh1 = load_mesh_from_file(file1.file, file1.filename)
        mesh2 = load_mesh_from_file(file2.file, file2.filename)
        if mesh1 is None or mesh2 is None:
            return {"error": "Failed to load one or both meshes"}
        cd = chamfer_distance(mesh1, mesh2)
        return {"chamfer_distance": cd}
    except Exception as e:
        return {"error": str(e)}

@app.get("/history")
async def get_history():
    return evaluation_history

@app.delete("/history")
async def clear_history():
    evaluation_history.clear()
    return {"message": "History cleared"}

@app.get("/health")
async def health():
    return {"status": "ok", "evaluations_count": len(evaluation_history)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)