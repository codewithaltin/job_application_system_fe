import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { Applicant } from './models/applicant';
@Component({
  selector: 'app-applicants-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './applicants-list.component.html',
  styleUrl: './applicants-list.component.scss',
})
export class ApplicantsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource = new MatTableDataSource<Applicant>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.dataSource.data = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 3, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 4, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 5, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 6, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 7, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 8, name: 'Jane Smith', email: 'jane.smith@example.com' },
    ];
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  trackByFn(index: number, item: Applicant): number {
    return item.id;
  }
}
