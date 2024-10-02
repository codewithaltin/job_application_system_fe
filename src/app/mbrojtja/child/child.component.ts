import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { ChildDialogComponent } from './child-dialog.component';
import { ChildService } from './service/child.service';
import { NotificationService } from '../../services/notification.service';
import { Child } from './model/child-model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [SharedModule, MatPaginatorModule],
  templateUrl: './child.component.html',
})
export class ChildComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  children: MatTableDataSource<Child> = new MatTableDataSource<Child>([]);
  displayedColumns: string[] = ['name', 'description', 'parent', 'actions'];

  constructor(
    private childService: ChildService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadChildren();
  }

  loadChildren(): void {
    this.childService.getAll().subscribe((children) => {
      this.children = new MatTableDataSource(children || []);
      this.children.paginator = this.paginator;
    });
  }

  openDialog(child?: Child): void {
    const dialogRef = this.dialog.open(ChildDialogComponent, {
      data: child
        ? { ...child, parent: child.parent || null }
        : { name: '', description: '', parent: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (child) {
          this.childService.update(child.id, result).subscribe(() => {
            this.notificationService.show('Updated successfully');
            this.loadChildren();
          });
        } else {
          this.childService.create(result).subscribe(() => {
            this.notificationService.show('Created successfully');
            this.loadChildren();
          });
        }
      }
    });
  }

  delete(id: number): void {
    this.childService.delete(id).subscribe(() => {
      this.notificationService.show('Deleted successfully');
      this.loadChildren();
    });
  }

  softDelete(id: number): void {
    this.childService.softDelete(id).subscribe(() => {
      this.notificationService.show('Deleted successfully');
      this.loadChildren();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.children.filter = filterValue.trim().toLowerCase();
  }
}
