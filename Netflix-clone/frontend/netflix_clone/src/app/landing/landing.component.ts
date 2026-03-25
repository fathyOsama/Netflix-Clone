import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  landingForm!: FormGroup;

  year = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.landingForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  getStarted() {
    this.router.navigate(['/signup'], {
      queryParams: { email:this.landingForm.value.email }
    });
  }

  reasons = [
    {
      Title: 'Enjoy on your TV',
      text: 'Watch on smart TVs, playstation, xbox, chromecast, Apple TV, Blu-ray players and more.',
      icon: 'tv'
    },
    {
      Title: 'Download your shows to watch offline',
      text: 'Save your favourites easily and always have something to watch.',
      icon: 'file_download'
    },
    {
      Title: 'Watch everywhere',
      text: 'Sttream unlomited movies and TV shows on your phone, tablet, laptop and TV.',
      icon: 'devices'
    },
    {
      Title: 'Create profiles for kids',
      text: 'Send kids on adventures in a space made just for them - free with your membership.',
      icon: 'face'
    }
  ]

  faqs = [
    {
      question: 'What is pulseScreen?',
      answer: 'pulesScreen is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more '
    },
    {
      question: 'How much does pulseScreen cost?',
      answer: 'Plans start at $149 a month. No extra costs, no contracts.'
    },
    {
      question: 'Where can I watch?.',
      answer: 'watch anywhere, anytime. sign in with your account to watch on the web or on devices like smartphones, tablets, smart TV and straming devices.'
    },
    {
      question: 'How do I cancel?',
      answer: 'you can cancel your membership online in teo clicks. There are no cancellation fees - start or stop your account anytime.'
    },
    {
      question: 'What can I watch on pulseScreen?',
      answer: 'A huge library of feature films, documentaries, anime, Tv shows, pulseScreen originals and more.'
    },
    {
      question: 'Is pulseScreen good for kids?',
      answer: 'The kids experience includes family-friendly entertainment with parental constrols to restrict content by maturity rating.'
    },
  ]
}
