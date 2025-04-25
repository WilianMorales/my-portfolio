import { Component } from '@angular/core';
import { Project } from '../../shared/interfaces/project.interface';
import { HttpClient } from '@angular/common/http';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  iconPortfolio = faBriefcase;
  projects: Project[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<Project[]>('assets/data/projects.json')
      .subscribe((work) => {
        this.projects = work;
      });
  }

}
