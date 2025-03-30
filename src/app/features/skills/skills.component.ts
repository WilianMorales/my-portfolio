import { Component } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngular, faHtml5, faCss3Alt, faNodeJs, faGithub, faJsSquare, faBootstrap, faTrello, faGitAlt, faSass, faBitbucket } from '@fortawesome/free-brands-svg-icons';
import { faCode, faServer } from '@fortawesome/free-solid-svg-icons';

export interface Skill {
  name: string;
  icon?: IconProp;
  color?: string;
  img?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {
  iconCode = faCode;

  skillsCategorias: SkillCategory[] = [
    {
      title: 'FRONTEND',
      skills: [
        { name: 'HTML5', icon: faHtml5, color: 'text-orange-500' },
        { name: 'CSS3', icon: faCss3Alt, color: 'text-blue-500' },
        { name: 'JS', icon: faJsSquare, color: 'text-yellow-500' },
        { name: 'Angular', icon: faAngular, color: 'text-red-600' },
        { name: 'TS', img: 'assets/images/skill/typescript.png' },
        { name: 'Bootstrap', icon: faBootstrap, color: 'text-purple-500' },
        { name: 'Tailwind Css', img: 'assets/images/skill/tailwindcss.png' },
        { name: 'Sass', icon: faSass, color: 'text-pink-400' },
      ]
    },
    {
      title: 'BACKEND',
      skills: [
        { name: 'SpringBoot', img: 'assets/images/skill/springboot.svg' },
        { name: '.Net', img: 'assets/images/skill/dotnet.svg' },
        { name: 'Node.js', icon: faNodeJs, color: 'text-green-600' },
        { name: 'MySQL', img: 'assets/images/skill/mysql.svg' },
        { name: 'SQL', icon: faServer, color: 'text-yellow-500' },
      ]
    },
    {
      title: 'TECHNICAL SKILLS',
      skills: [
        { name: 'GitHub', icon: faGithub, color: 'text-gray-700' },
        { name: 'Git', icon: faGitAlt, color: 'text-red-500' },
        { name: 'Postman', img: 'assets/images/skill/postman.svg' },
        { name: 'Tello', icon: faTrello, color: 'text-blue-400' },
        { name: 'Bitbucket', icon: faBitbucket, color: 'text-blue-500' },
        { name: 'Scrum', img: 'assets/images/skill/scrum.png' }
      ]
    }
  ];

}
