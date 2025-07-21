import { pipeline, env } from '@xenova/transformers';
env.allowLocalModels = false;

// Map languages to appropriate models that actually exist
function getModelForLanguage(tgt_lang) {
    // Use individual models that are known to exist in Xenova
    const availableModels = {
        'fra_Latn': 'Xenova/opus-mt-en-fr',  // English to French
        'spa_Latn': 'Xenova/opus-mt-en-es',  // English to Spanish
        'deu_Latn': 'Xenova/opus-mt-en-de',  // English to German
        'ita_Latn': 'Xenova/opus-mt-en-it',  // English to Italian
        'por_Latn': 'Xenova/opus-mt-en-pt',  // English to Portuguese
        'rus_Cyrl': 'Xenova/opus-mt-en-ru',  // English to Russian
        'nld_Latn': 'Xenova/opus-mt-en-nl',  // English to Dutch
        'pol_Latn': 'Xenova/opus-mt-en-pl',  // English to Polish
        'ces_Latn': 'Xenova/opus-mt-en-cs',  // English to Czech
        'fin_Latn': 'Xenova/opus-mt-en-fi',  // English to Finnish
        'swe_Latn': 'Xenova/opus-mt-en-sv',  // English to Swedish
        'dan_Latn': 'Xenova/opus-mt-en-da',  // English to Danish
        'nob_Latn': 'Xenova/opus-mt-en-no',  // English to Norwegian
        'hun_Latn': 'Xenova/opus-mt-en-hu',  // English to Hungarian
        'ron_Latn': 'Xenova/opus-mt-en-ro',  // English to Romanian
        'ukr_Cyrl': 'Xenova/opus-mt-en-uk',  // English to Ukrainian
        'tur_Latn': 'Xenova/opus-mt-en-tr',  // English to Turkish
        'zho_Hans': 'Xenova/opus-mt-en-zh',  // English to Chinese
        'jpn_Jpan': 'Xenova/opus-mt-en-ja',  // English to Japanese
        'kor_Hang': 'Xenova/opus-mt-en-ko',  // English to Korean
        'arb_Arab': 'Xenova/opus-mt-en-ar',  // English to Arabic
        'hin_Deva': 'Xenova/opus-mt-en-hi',  // English to Hindi
        // For other languages, fall back to a mock translation
    };
    
    return availableModels[tgt_lang] || null;
}

// Get language name for unsupported languages
function getLanguageName(langCode) {
    const languageNames = {
        'fra_Latn': 'French',
        'spa_Latn': 'Spanish',
        'deu_Latn': 'German',
        'ita_Latn': 'Italian',
        'por_Latn': 'Portuguese',
        'rus_Cyrl': 'Russian',
        'nld_Latn': 'Dutch',
        'zho_Hans': 'Chinese',
        'jpn_Jpan': 'Japanese',
        'kor_Hang': 'Korean',
        'hin_Deva': 'Hindi',
        'asm_Beng': 'Bengali',
        'ben_Beng': 'Bengali',
        'arb_Arab': 'Arabic',
        'tur_Latn': 'Turkish',
        'pol_Latn': 'Polish',
        'ces_Latn': 'Czech',
        'hun_Latn': 'Hungarian',
        'fin_Latn': 'Finnish',
        'swe_Latn': 'Swedish',
        'dan_Latn': 'Danish',
        'nob_Latn': 'Norwegian'
    };
    return languageNames[langCode] || 'Unknown Language';
}

class MyTranslationPipeline {
    static instances = new Map();

    static async getInstance(model, progress_callback = null) {
        if (!this.instances.has(model)) {
            const instance = await pipeline('translation', model, { progress_callback });
            this.instances.set(model, instance);
        }
        return this.instances.get(model);
    }
}

self.addEventListener('message', async (event) => {
    try {
        self.postMessage({ status: 'initiate' });
        
        const text = Array.isArray(event.data.text) ? event.data.text.join(' ') : event.data.text;
        const targetLang = event.data.tgt_lang;
        const model = getModelForLanguage(targetLang);
        
        if (model) {
            // Use specific OPUS-MT model for supported languages
            try {
                let translator = await MyTranslationPipeline.getInstance(model, x => {
                    self.postMessage({ status: 'progress', ...x })
                });
                
                let output = await translator(text, {
                    callback_function: x => {
                        self.postMessage({
                            status: 'update',
                            output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
                        })
                    }
                });
                
                self.postMessage({
                    status: 'complete',
                    output: output[0].translation_text || output[0].generated_text || (typeof output === 'string' ? output : 'Translation completed')
                });
                
            } catch (modelError) {
                console.error('Model error:', modelError);
                // If the specific model fails, provide a meaningful message
                const langName = getLanguageName(targetLang);
                self.postMessage({
                    status: 'complete',
                    output: `${langName} translation model failed to load. Please try again or select a different language.`
                });
            }
            
        } else {
            // This should rarely happen now since we only show supported languages
            const langName = getLanguageName(targetLang);
            self.postMessage({
                status: 'complete',
                output: `${langName} translation is not currently supported.`
            });
        }
        
    } catch (error) {
        console.error('Translation error:', error);
        
        const text = Array.isArray(event.data.text) ? event.data.text.join(' ') : event.data.text;
        self.postMessage({
            status: 'complete',
            output: `Translation failed for: "${text}". Please try again.`
        });
    }
})