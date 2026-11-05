import type { CareerCluster, Trait } from '../types'

/**
 * The Career Finder shows vivid "would you rather" scenarios. Each option
 * nudges career clusters (and lightly, traits). It is designed for students
 * who have no idea what they want yet.
 */
export interface FinderOption {
  id: string
  text: string
  clusters: Partial<Record<CareerCluster, number>>
  traits?: Partial<Record<Trait, number>>
}

export interface FinderQuestion {
  id: string
  prompt: string
  options: FinderOption[]
}

export const FINDER_QUESTIONS: FinderQuestion[] = [
  {
    id: 'saturday',
    prompt: 'It is Saturday and you have the whole day free. What sounds best?',
    options: [
      { id: 'a', text: 'Fixing or building something: a bike, a model, a gadget', clusters: { 'engineering-tech': 1, 'defence-aviation': 0.3 }, traits: { realistic: 1 } },
      { id: 'b', text: 'Making a video, drawing, or writing a story', clusters: { 'arts-design-media': 1 }, traits: { artistic: 1 } },
      { id: 'c', text: 'Playing games on the computer and wondering how they are made', clusters: { 'computing-data': 1 }, traits: { investigative: 0.6 } },
      { id: 'd', text: 'Hanging out with friends, helping someone, or organising something fun', clusters: { 'education-social': 0.8, 'business-finance': 0.5 }, traits: { social: 0.8, enterprising: 0.4 } },
    ],
  },
  {
    id: 'hero',
    prompt: 'Someone in your town is in trouble. Which hero would you rather be?',
    options: [
      { id: 'a', text: 'The doctor who saves them', clusters: { 'medicine-health': 1 }, traits: { social: 0.5, investigative: 0.5 } },
      { id: 'b', text: 'The lawyer who gets them justice', clusters: { 'law-governance': 1 }, traits: { enterprising: 0.7 } },
      { id: 'c', text: 'The engineer who rebuilds their home', clusters: { 'engineering-tech': 1 }, traits: { realistic: 0.7 } },
      { id: 'd', text: 'The reporter who tells the world their story', clusters: { 'arts-design-media': 1 }, traits: { artistic: 0.5, enterprising: 0.5 } },
    ],
  },
  {
    id: 'classroom',
    prompt: 'Which school moment makes you feel most alive?',
    options: [
      { id: 'a', text: 'Solving a hard maths problem before anyone else', clusters: { 'computing-data': 0.8, 'engineering-tech': 0.6, 'business-finance': 0.4 }, traits: { investigative: 1 } },
      { id: 'b', text: 'A science experiment that actually works', clusters: { 'science-research': 1, 'medicine-health': 0.5 }, traits: { investigative: 0.8, realistic: 0.4 } },
      { id: 'c', text: 'Winning a debate or giving a speech', clusters: { 'law-governance': 1, 'business-finance': 0.5 }, traits: { enterprising: 1 } },
      { id: 'd', text: 'Art class, drama, or the school magazine', clusters: { 'arts-design-media': 1 }, traits: { artistic: 1 } },
    ],
  },
  {
    id: 'workplace',
    prompt: 'Imagine your future workplace. Where are you?',
    options: [
      { id: 'a', text: 'A busy hospital with people who need me', clusters: { 'medicine-health': 1 }, traits: { social: 0.7 } },
      { id: 'b', text: 'A modern office with a big screen, or working from anywhere with a laptop', clusters: { 'computing-data': 1, 'business-finance': 0.5 }, traits: { conventional: 0.4 } },
      { id: 'c', text: 'Outdoors: a construction site, an air base, a field', clusters: { 'engineering-tech': 0.7, 'defence-aviation': 1 }, traits: { realistic: 1 } },
      { id: 'd', text: 'A studio, a classroom, or a stage', clusters: { 'arts-design-media': 0.8, 'education-social': 0.8 }, traits: { artistic: 0.6, social: 0.6 } },
    ],
  },
  {
    id: 'proud',
    prompt: 'Twenty years from now, which would make you proudest?',
    options: [
      { id: 'a', text: 'I built a company that gives hundreds of people jobs', clusters: { 'business-finance': 1 }, traits: { enterprising: 1 } },
      { id: 'b', text: 'I discovered something nobody knew before', clusters: { 'science-research': 1, 'computing-data': 0.4 }, traits: { investigative: 1 } },
      { id: 'c', text: 'I changed laws or ran a district so life got better for everyone', clusters: { 'law-governance': 1 }, traits: { enterprising: 0.6, social: 0.5 } },
      { id: 'd', text: 'I taught or healed thousands of people, one at a time', clusters: { 'education-social': 1, 'medicine-health': 0.8 }, traits: { social: 1 } },
    ],
  },
  {
    id: 'problem',
    prompt: 'Your phone stops working. What do you do first?',
    options: [
      { id: 'a', text: 'Open it up or search how to fix it myself', clusters: { 'engineering-tech': 1, 'computing-data': 0.6 }, traits: { realistic: 0.8, investigative: 0.5 } },
      { id: 'b', text: 'Figure out the pattern: when does it fail, what changed?', clusters: { 'science-research': 0.8, 'computing-data': 0.8 }, traits: { investigative: 1 } },
      { id: 'c', text: 'Convince the shop to replace it for free', clusters: { 'business-finance': 0.8, 'law-governance': 0.8 }, traits: { enterprising: 1 } },
      { id: 'd', text: 'Borrow a friend’s and get on with my day', clusters: { 'education-social': 0.6, 'arts-design-media': 0.4 }, traits: { social: 0.6 } },
    ],
  },
  {
    id: 'money',
    prompt: 'Be honest: how much does money matter in your dream job?',
    options: [
      { id: 'a', text: 'A lot. I want to earn really well', clusters: { 'computing-data': 0.6, 'business-finance': 0.8, 'medicine-health': 0.4, 'defence-aviation': 0.3 }, traits: { enterprising: 0.5 } },
      { id: 'b', text: 'Enough to be comfortable; meaning matters more', clusters: { 'education-social': 0.6, 'science-research': 0.5, 'medicine-health': 0.4 }, traits: { social: 0.4 } },
      { id: 'c', text: 'I want to do what I love even if it pays less', clusters: { 'arts-design-media': 0.8, 'science-research': 0.4 }, traits: { artistic: 0.6 } },
      { id: 'd', text: 'I want respect and a role in society', clusters: { 'law-governance': 0.8, 'defence-aviation': 0.6, 'medicine-health': 0.4 }, traits: { enterprising: 0.4, conventional: 0.4 } },
    ],
  },
  {
    id: 'style',
    prompt: 'Which way of working sounds most like you?',
    options: [
      { id: 'a', text: 'Clear rules, careful steps, getting it exactly right', clusters: { 'business-finance': 0.8, 'medicine-health': 0.5, 'defence-aviation': 0.5 }, traits: { conventional: 1 } },
      { id: 'b', text: 'Freedom to try new ideas, even if some fail', clusters: { 'arts-design-media': 0.7, 'computing-data': 0.6, 'science-research': 0.6 }, traits: { artistic: 0.6, investigative: 0.5 } },
      { id: 'c', text: 'Leading a team and making the big calls', clusters: { 'business-finance': 0.7, 'law-governance': 0.6, 'defence-aviation': 0.6 }, traits: { enterprising: 1 } },
      { id: 'd', text: 'Hands-on, moving around, not stuck at a desk', clusters: { 'engineering-tech': 0.8, 'medicine-health': 0.4, 'defence-aviation': 0.6 }, traits: { realistic: 1 } },
    ],
  },
]
