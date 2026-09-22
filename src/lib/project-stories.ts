// Editorial context verified against the published demos on 2026-09-22.
// The owner confirmed all three are personal projects, conceived and built by him.
// Keep unverified results and client claims out of public copy.
export interface ProjectStory {
  summary: string;
  context: string;
  solution: string;
  features: string[];
}
const stories: Record<string, Record<"pt" | "en", ProjectStory>> = {
  "6PwfsjsFda7ov256pJJf": {
    pt: {
      summary:
        "Um website de restauração que reúne menu, ambiente e uma interface para pedidos de reserva.",
      context:
        "Explorar como um restaurante pode apresentar a sua oferta e orientar o visitante até a um pedido de reserva.",
      solution:
        "Uma experiência de navegação com menu por categorias, história do espaço, galeria e formulário de reserva. A demonstração apresenta a interface; a entrega de reservas não está confirmada.",
      features: [
        "Menu organizado por categorias",
        "Galeria e apresentação do restaurante",
        "Interface de reserva com data, hora e número de pessoas",
      ],
    },
    en: {
      summary:
        "A restaurant website bringing together the menu, atmosphere and a booking enquiry interface.",
      context:
        "Explore how a restaurant can present its offering and guide visitors towards a booking enquiry.",
      solution:
        "A website with a categorised menu, restaurant story, gallery and booking form. The demo showcases the interface; delivery of booking requests is not confirmed.",
      features: [
        "Menu organised by category",
        "Restaurant story and gallery",
        "Booking interface with date, time and party size",
      ],
    },
  },
  sGKd9KxTO96YWXrrd0Pe: {
    pt: {
      summary:
        "O clássico jogo Stop numa aplicação web, com salas, categorias e pontuação.",
      context:
        "Adaptar o jogo Stop ao navegador, reunindo as etapas de entrada numa sala, escolha de categorias e pontuação numa experiência digital.",
      solution:
        "Uma aplicação que apresenta criação e entrada em salas por código, personalização do jogador e regras de pontuação. A ligação pública permite explorar a experiência.",
      features: [
        "Criação e entrada em salas por código",
        "Perfil com nome, avatar e cor",
        "Categorias, regras de pontuação e ranking",
      ],
    },
    en: {
      summary:
        "The classic Stop word game as a web app, with rooms, categories and scoring.",
      context:
        "Bring the Stop word game to the browser, combining room entry, categories and scoring in a digital experience.",
      solution:
        "An app featuring room creation and entry by code, player customisation and scoring rules. The public link lets you explore the experience.",
      features: [
        "Room creation and entry by code",
        "Player name, avatar and colour",
        "Categories, scoring rules and leaderboard",
      ],
    },
  },
  vpbZOSmseBEewKmmmOAG: {
    pt: {
      summary:
        "Uma página de apresentação de cosméticos naturais, com características, história e perguntas frequentes.",
      context:
        "Explorar a apresentação de uma marca de cosméticos, organizando a informação que um visitante procura antes de entrar em contacto.",
      solution:
        "Uma landing page com secções de características, apresentação da marca, perguntas frequentes e chamadas para contacto. Um exercício pessoal de comunicação e interface para a web.",
      features: [
        "Apresentação da marca e das características",
        "Navegação entre secções",
        "Perguntas frequentes e chamadas para contacto",
      ],
    },
    en: {
      summary:
        "A natural cosmetics landing page with product characteristics, brand story and frequently asked questions.",
      context:
        "Explore how to present a cosmetics brand and organise the information visitors look for before getting in touch.",
      solution:
        "A landing page with product characteristics, a brand introduction, frequently asked questions and contact prompts. A personal exploration of web communication and interface design.",
      features: [
        "Brand introduction and product characteristics",
        "Section navigation",
        "Frequently asked questions and contact prompts",
      ],
    },
  },
};
export const featuredProjectIds = [
  "6PwfsjsFda7ov256pJJf",
  "sGKd9KxTO96YWXrrd0Pe",
  "vpbZOSmseBEewKmmmOAG",
];
export const getProjectStory = (id: string, locale: string) =>
  stories[id]?.[locale === "pt" ? "pt" : "en"];
