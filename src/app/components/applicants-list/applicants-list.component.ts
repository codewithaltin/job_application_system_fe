import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Applicant } from './models/applicant';
import { SharedModule } from '../../shared/shared.module';
import { ApplicantListService } from '../../services/applicant-list.service';

@Component({
  selector: 'app-applicants-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './applicants-list.component.html',
  styleUrls: ['./applicants-list.component.scss'],
})
export class ApplicantsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'actions'];
  dataSource = new MatTableDataSource<Applicant>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private applicantListService: ApplicantListService) {}

  ngOnInit(): void {
    this.fetchApplicants();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchApplicants(): void {
    this.applicantListService.getApplicants().subscribe({
      next: (data: Applicant[]) => {
        this.dataSource.data = data;
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  trackByFn(index: number, item: Applicant): string {
    return item.id;
  }

  deleteApplicant(_t39: any) {
    throw new Error('Method not implemented.');
  }
  editApplicant(_t39: any) {
    throw new Error('Method not implemented.');
  }
}
