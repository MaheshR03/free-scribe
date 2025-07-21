import React, { useState, useEffect, useRef } from 'react'
import Transcription from './Transcription'
import Translation from './Translation'

export default function Information(props) {
    const { output, finished } = props
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')
    const [translating, setTranslating] = useState(false)
    
    console.log('Information component state:', { tab, translating, toLanguage, translation });
    console.log('output:', output);

    const worker = useRef()

    useEffect(() => {
        console.log('useEffect running - setting up translation worker');
        if (!worker.current) {
            console.log('Creating new translation worker');
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
            console.log('Translation worker created:', worker.current);
        }

        const onMessageReceived = async (e) => {
            console.log('Translation worker message:', e.data);
            switch (e.data.status) {
                case 'initiate':
                    console.log('Translation model initializing...')
                    break;
                case 'progress':
                    console.log('Translation model loading...')
                    break;
                case 'update':
                    setTranslation(e.data.output)
                    console.log('Translation update:', e.data.output)
                    break;
                case 'complete':
                    setTranslating(false)
                    // Ensure we always set a string, not an object or array
                    const translationText = typeof e.data.output === 'string' 
                        ? e.data.output 
                        : (Array.isArray(e.data.output) 
                            ? e.data.output.map(t => t.translation_text || t.generated_text || t).join(' ')
                            : e.data.output.translation_text || e.data.output.generated_text || e.data.output);
                    setTranslation(translationText)
                    console.log("Translation complete:", translationText)
                    break;
                case 'error':
                    setTranslating(false)
                    console.error('Translation error:', e.data.error)
                    break;
                default:
                    // Handle other message formats from model loading
                    if (e.data.file) {
                        console.log('Loading:', e.data.file)
                    }
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => {
            console.log('Cleaning up translation worker listener');
            worker.current.removeEventListener('message', onMessageReceived)
        }
    }, []) // Added dependency array

    const textElement = tab === 'transcription' 
        ? output.map(val => val.text).join(' ') 
        : (typeof translation === 'string' ? translation : (Array.isArray(translation) ? translation.map(t => t.translation_text || t).join(' ') : translation || ''))

    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement("a")
        const file = new Blob([textElement], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `Freescribe_${new Date().toString()}.txt`
        document.body.appendChild(element)
        element.click()
    }

    function generateTranslation() {
        if (translating || toLanguage === 'Select language') {
            return
        }

        setTranslating(true)
        setTranslation(null) // Clear previous translation

        const textToTranslate = output.map(val => val.text).join(' ');
        
        worker.current.postMessage({
            text: textToTranslate,
            src_lang: 'eng_Latn',
            tgt_lang: toLanguage
        })
    }




    return (
        <main className='flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto'>
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'>Your <span className='text-blue-400 bold'>Transcription</span></h1>

            <div className='grid grid-cols-2 sm:mx-auto bg-white  rounded overflow-hidden items-center p-1 blueShadow border-[2px] border-solid border-blue-300'>
                <button onClick={() => {
                    console.log('Switching to transcription tab');
                    setTab('transcription');
                }} className={'px-4 rounded duration-200 py-1 ' + (tab === 'transcription' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Transcription</button>
                <button onClick={() => {
                    console.log('Switching to translation tab');
                    setTab('translation');
                }} className={'px-4 rounded duration-200 py-1  ' + (tab === 'translation' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Translation</button>
            </div>
            <div className='my-8 flex flex-col-reverse max-w-prose w-full mx-auto gap-4'>
                {(!finished || translating) && (
                    <div className='grid place-items-center'>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                    </div>
                )}
                {tab === 'transcription' ? (
                    <>
                        {console.log('Rendering Transcription component')}
                        <Transcription {...props} textElement={textElement} />
                    </>
                ) : (
                    <>
                        {console.log('Rendering Translation component')}
                        <Translation {...props} toLanguage={toLanguage} translating={translating} textElement={textElement} setTranslating={setTranslating} setTranslation={setTranslation} setToLanguage={setToLanguage} generateTranslation={generateTranslation} />
                    </>
                )}
            </div>
            <div className='flex items-center gap-4 mx-auto '>
                <button onClick={handleCopy} title="Copy" className='bg-white  hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded'>
                    <i className="fa-solid fa-copy"></i>
                </button>
                <button onClick={handleDownload} title="Download" className='bg-white  hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded'>
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>
        </main>
    )
}