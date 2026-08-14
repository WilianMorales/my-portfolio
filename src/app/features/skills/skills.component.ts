import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngular,
  faHtml5,
  faCss3Alt,
  faNodeJs,
  faGithub,
  faJsSquare,
  faBootstrap,
  faGitAlt,
  faSass,
  faBitbucket,
  faWordpress,
  faReact
} from '@fortawesome/free-brands-svg-icons';
import { faCode, faServer } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface Skill {
  name: string;
  icon?: IconProp;
  color?: string;
  img?: string;
  wrapName?: boolean;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, NgClass, TranslatePipe, NgOptimizedImage]
})
export class SkillsComponent {
  readonly iconCode = faCode;

  readonly skillsCategorias: SkillCategory[] = [
    {
      title: 'FRONTEND',
      skills: [
        { name: 'HTML5', icon: faHtml5, color: 'text-orange-500' },
        { name: 'CSS3', icon: faCss3Alt, color: 'text-blue-500' },
        { name: 'JavaScript', icon: faJsSquare, color: 'text-yellow-500' },
        { name: 'TypeScript', img: 'assets/images/skill/typescript.webp' },
        { name: 'Angular', icon: faAngular, color: 'text-red-600' },
        { name: 'React', icon: faReact, color: 'text-sky-400' },
        { name: 'Bootstrap', icon: faBootstrap, color: 'text-purple-500' },
        { name: 'TailwindCSS', img: 'assets/images/skill/tailwindcss.webp' },
        { name: 'Sass', icon: faSass, color: 'text-pink-400' }
      ]
    },
    {
      title: 'Backend & Integration',
      skills: [
        { name: 'Spring Boot', img: 'assets/images/skill/springboot.svg' },
        { name: '.NET', img: 'assets/images/skill/dotnet.svg' },
        { name: 'Node.js', icon: faNodeJs, color: 'text-green-600' },
        { name: 'Node-RED', img: 'assets/images/skill/node-red.webp' },
        { name: 'PostgreSQL', img: 'assets/images/skill/postgresql.svg' },
        { name: 'MySQL', img: 'assets/images/skill/mysql.svg' },
        { name: 'SQL Server', icon: faServer, color: 'text-yellow-500' }
      ]
    },
    {
      title: 'Cloud & DevOps',
      skills: [
        { name: 'Docker', img: 'assets/images/skill/docker.svg' },
        { name: 'GitHub Actions', img: 'assets/images/skill/github-actions.svg', wrapName: true },
        { name: 'Cloudflare', img: 'assets/images/skill/cloudflare.webp' },
        { name: 'Git', icon: faGitAlt, color: 'text-red-500' },
        { name: 'GitHub', icon: faGithub, color: 'text-gray-700' },
        { name: 'GitLab', img: 'assets/images/skill/gitlab.svg' },
        { name: 'Bitbucket', icon: faBitbucket, color: 'text-blue-500' }
      ]
    },
    {
      title: 'Tools & Methodologies',
      skills: [
        { name: 'VS Code', img: 'assets/images/skill/vscode.svg' },
        { name: 'Cursor', img: 'assets/images/skill/cursor.svg' },
        { name: 'Postman', img: 'assets/images/skill/postman.svg' },
        { name: 'Bruno', img: 'assets/images/skill/bruno.webp' },
        { name: 'Figma', img: 'assets/images/skill/figma.svg' },
        { name: 'Jira', img: 'assets/images/skill/jira.svg' },
        { name: 'Power Automate', img: 'assets/images/skill/power-automate.webp', wrapName: true },
        { name: 'Scrum', img: 'assets/images/skill/scrum.webp' },
        { name: 'WordPress', icon: faWordpress, color: 'text-white' }
      ]
    }
  ];
}
