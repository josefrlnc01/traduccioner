import whisper
import sys
import json

def transcribe(audio_path,lang):
    model= whisper.load_model('base')
    result= model.transcribe(audio_path,lang)
    return result

if __name__ == "__main__":
    audio_path= sys.argv[1]
    result= transcribe(audio_path, lang="es")
    print(json.dumps(audio_path, ensure_ascii=False))
