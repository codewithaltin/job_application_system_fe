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
import { ParentService } from '../parent/service/parent.service';
import { Parent } from '../parent/model/parent-model';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [SharedModule, MatPaginatorModule],
  templateUrl: './child.component.html',
})
export class ChildComponent implements OnInit {
  children: Child[] = [];
  parents: Parent[] = [];
  displayedColumns: string[] = ['name', 'age', 'number', 'parent', 'actions'];
  filteredChildren: Child[] = [];

  constructor(
    private childService: ChildService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private parentService: ParentService
  ) {}

  ngOnInit(): void {
    this.loadChildren();
    this.loadParents();
  }

  loadChildren(): void {
      this.childService.getAll().subscribe((children) => { 
      this.children = children;
      this.filteredChildren = children.filter(child=> !child.deleted);
    });
  }

  openDialog(child?: Child): void {
    const dialogRef = this.dialog.open(ChildDialogComponent, {
      data: child
        ? { ...child, parent: child.parent || null }
        : { name: '', age: '', number: '',  parent: null },
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

  loadParents(): void {
    this.parentService.getAll().subscribe((parents) => {
      this.parents = parents || [];
    });
  }

  applyFilter(filterValue: number) {
    this.filteredChildren = this.children.filter((child) => {
      return child.parent.id === filterValue;
    });
  }
}
