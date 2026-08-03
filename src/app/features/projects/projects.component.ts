import { Component } from '@angular/core';
import { Project } from '../../shared/interfaces/project.interface';
import { HttpClient } from '@angular/common/http';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor } from '@angular/common';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  imports: [FaIconComponent, NgFor, ProjectCardComponent, TranslatePipe]
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
