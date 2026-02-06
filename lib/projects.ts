export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  features?: string[]
  texture: string
  type: 'animated' | 'screenshot' | 'logo' | 'contact'
  technologies: string[]
  link?: string
  github?: string
  playStore?: string
  appStore?: string
  color: string
}

export const projects: Project[] = [
  {
    id: 'Libertarian-Stone',
    title: 'Libertarian Stone',
    description: 'Educational Philosophy Platform',
    longDescription: 'Libertarian Stone is an educational app built with Flutter that offers a complete platform for learning libertarian philosophy. It combines a library, YouTube videos, interactive games, personal notes, a gamified achievement system, premium content, and productivity tools.',
    features: ['Multi-format Library', 'Interactive Games', 'Gamified Achievements', 'Premium Content', 'YouTube Integration'],
    texture: '/textures/Libertarian_Stone_Placeholder.jpeg',
    type: 'animated',
    technologies: ['Flutter', 'Dart', 'Firebase'],
    playStore: 'https://play.google.com/store/apps/details?id=com.leonardofeitosa.pedras_libertarias',
    appStore: 'https://apps.apple.com', // TODO: Add App Store link when available
    color: '#F7931A',
  },
  {
    id: 'arcapy',
    title: 'ArcaPy',
    description: 'Real Estate Marketplace',
    longDescription: 'ArcaPy is a complete real estate marketplace platform for properties in Paraguay. Built with React 19, Express, and TypeScript, it features a full property management system, image upload, favorites, notifications, subscription and payment system, and multi-language support (ES/PT/EN).',
    features: ['Property Management', 'Image Upload', 'Payments & Subscriptions', 'Multi-language (ES/PT/EN)'],
    texture: '/textures/ArcaPy_placeholder.webp',
    type: 'screenshot',
    technologies: ['React', 'Express', 'TypeScript', 'PostgreSQL'],
    link: 'https://arcapy.com',
    github: 'https://github.com/liberblock/arcapy', //TODO: change link
    color: '#3776AB',
  },
  {
    id: 'garden-rosas-decor',
    title: 'GardenRosasDecor',
    description: 'Full-Stack E-commerce',
    longDescription: 'A complete e-commerce system for artificial flowers and religious articles shop in Brazil. Features user authentication, shopping cart, order management system, and payment integration — all built to serve a real local business.',
    features: ['User Authentication', 'Shopping Cart', 'Order Management', 'Payment Integration', 'Product Catalog', 'Responsive Design'],
    texture: '/textures/GardenRosasDecor_placeholder.png',
    type: 'screenshot',
    technologies: ['Flask', 'Python', 'JavaScript', 'Stripe'],
    link: 'https://www.gardenrosasdecor.com',
    color: '#db1ccb',
  },
  {
    id: 'rpg-2d-godot',
    title: 'RPG 2D Godot',
    description: '2D adventure game',
    longDescription: 'A retro-styled 2D RPG built with Godot engine.',
    texture: '/textures/Jogo2D_placeholder.svg',
    type: 'animated',
    technologies: ['Godot', 'GDScript', '2D Art', 'Steam'],
    github: 'https://github.com/liberblock/rpg-2d', //TODO: change link
    color: '#ffffff',
  },
  {
    id: 'liberblock-logo',
    title: 'LiberBlock',
    description: 'Digital Innovation Studio',
    longDescription: 'We build cutting-edge digital products with cypherpunk aesthetics and modern technology.',
    texture: '', // No texture for logo type, add link
    type: 'logo',
    technologies: [],  
    color: '#F7931A',
  },
  {
    id: 'contact',
    title: 'Get in Touch',
    description: "Let's build something amazing",
    longDescription: 'Ready to start your next project? Contact us to discuss how we can help bring your ideas to life.',
    texture: '',
    type: 'contact',
    technologies: [],
    color: '#D4AF37',
  },
]
