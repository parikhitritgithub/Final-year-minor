import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GeneratorHeader from './GeneratorHeader'
import ControlPanel from './ControlPanel'
import PreviewPanel from './PreviewPanel'
import GeneratorFooter from './GeneratorFooter'
import './GeneratorPage.css'

function GeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [detailLevel, setDetailLevel] = useState('Med')
  const [textureQuality, setTextureQuality] = useState('Standard')
  const [format, setFormat] = useState('OBJ')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedModel, setGeneratedModel] = useState(null)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    // Simulate generation process
    setTimeout(() => {
      setGeneratedModel({
        url: 'https://images.pexels.com/photos/25626513/pexels-photo-25626513.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        prompt: prompt
      })
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="generator-page">
      <GeneratorHeader />
      <main className="generator-main">
        <div className="container">
          <div className="generator-workspace">
            <ControlPanel
              prompt={prompt}
              setPrompt={setPrompt}
              detailLevel={detailLevel}
              setDetailLevel={setDetailLevel}
              textureQuality={textureQuality}
              setTextureQuality={setTextureQuality}
              format={format}
              setFormat={setFormat}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
            <PreviewPanel
              generatedModel={generatedModel}
              isGenerating={isGenerating}
              prompt={prompt}
            />
          </div>
        </div>
      </main>
      <GeneratorFooter />
    </div>
  )
}

export default GeneratorPage
