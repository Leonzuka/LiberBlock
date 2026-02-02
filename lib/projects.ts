export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  texture: string
  type: 'animated' | 'screenshot' | 'logo' | 'contact'
  technologies: string[]
  link?: string
  github?: string
  color: string
}

export const projects: Project[] = [
  {
    id: 'Libertarian-Stone',
    title: 'Libertarian Stone',
    description: 'Philosophical learning-gaming experience',
    longDescription: 'An immersive app about libertarian philosophy through interactive books, games and videos.',
    texture: '/textures/Libertarian_Stone_Placeholder.jpeg',
    type: 'animated',
    technologies: ['Flutter', 'Dart'],
    color: '#F7931A',
  },
  {
    id: 'arcapy',
    title: 'ArcaPy',
    description: 'Python automation toolkit',
    longDescription: 'A website to view and publish real states properties in Paraguay.',
    texture: '/textures/ArcaPy_placeholder.webp',
    type: 'screenshot',
    technologies: ['React', 'NodeJs', 'PostgreSQL'],
    github: 'https://github.com/liberblock/arcapy', //TODO: change link
    color: '#3776AB',
  },
  {
    id: 'garden-rosas-decor',
    title: 'GardenRosasDecor',
    description: 'E-commerce platform',
    longDescription: 'Beautiful e-commerce for a garden decoration with payment integration with focus in Brazil.',
    texture: '/textures/GardenRosasDecor_placeholder.png',
    type: 'screenshot',
    technologies: ['Flask(Python)', 'JavaScript', 'Stripe'],
    link: 'https://www.gardenrosasdecor.com',
    color: '#db1ccb',
  },
  {
    id: 'rpg-2d-godot',
    title: 'RPG 2D Godot',
    description: '2D adventure game',
    longDescription: 'A retro-styled 2D RPG built with Godot engine featuring pixel art graphics.',
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
