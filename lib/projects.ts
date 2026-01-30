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
    id: 'pedra-libertaria',
    title: 'Pedra Libertária',
    description: 'Philosophical gaming experience',
    longDescription: 'An immersive game exploring libertarian philosophy through interactive storytelling and strategic decision-making.',
    texture: '/textures/Libertarian_Stone_Placeholder.jpeg',
    type: 'animated',
    technologies: ['Unity', 'C#', 'Blockchain'],
    color: '#F7931A',
  },
  {
    id: 'arcapy',
    title: 'ArcaPy',
    description: 'Python automation toolkit',
    longDescription: 'A powerful Python library for cryptocurrency trading automation and portfolio management with advanced analytics.',
    texture: '/textures/ArcaPy_placeholder.webp',
    type: 'screenshot',
    technologies: ['Python', 'FastAPI', 'PostgreSQL'],
    github: 'https://github.com/liberblock/arcapy',
    color: '#3776AB',
  },
  {
    id: 'garden-rosas-decor',
    title: 'GardenRosasDecor',
    description: 'E-commerce platform',
    longDescription: 'Beautiful e-commerce solution for a garden decoration business with custom CMS and payment integration.',
    texture: '/textures/GardenRosasDecor_placeholder.png',
    type: 'screenshot',
    technologies: ['Next.js', 'Tailwind', 'Stripe'],
    link: 'https://gardenrosasdecor.com',
    color: '#10B981',
  },
  {
    id: 'rpg-2d-godot',
    title: 'RPG 2D Godot',
    description: '2D adventure game',
    longDescription: 'A retro-styled 2D RPG built with Godot engine featuring pixel art graphics and turn-based combat system.',
    texture: '/textures/Jogo2D_placeholder.svg',
    type: 'animated',
    technologies: ['Godot', 'GDScript', 'Aseprite'],
    github: 'https://github.com/liberblock/rpg-2d',
    color: '#478CBF',
  },
  {
    id: 'liberblock-logo',
    title: 'LiberBlock',
    description: 'Digital Innovation Studio',
    longDescription: 'We build cutting-edge digital products with cypherpunk aesthetics and modern technology.',
    texture: '',
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
