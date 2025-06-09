import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth = window.speechSynthesis;
  private utterance = new SpeechSynthesisUtterance();

  speak(text: string) {
    this.utterance.text = text;
    this.synth.speak(this.utterance);
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }

  cancel() {
    this.synth.cancel();
  }
}
