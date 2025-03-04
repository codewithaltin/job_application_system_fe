import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { ParentDialogComponent } from './parent-dialog.component';
import { Parent } from './model/parent-model';
import { ParentService } from './service/parent.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './parent.component.html',
})
export class ParentComponent implements OnInit {
  parents: Parent[] = [];
  displayedColumns: string[] = ['name', 'location', 'actions']; //NDRROJ KTO KOLONA SIPAS MODELIT TE INTERFACE TEK parent-model.ts

  constructor(
    private parentService: ParentService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadParents();
  }

  loadParents(): void {
    this.parentService.getAll().subscribe((parents) => {
      this.parents = parents;
    });
  }

  openDialog(parent?: Parent): void {
    const dialogRef = this.dialog.open(ParentDialogComponent, {
      data: parent ? { ...parent } : { name: '', location: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (parent) {
          this.parentService.update(parent.id, result).subscribe(() => {
            this.notificationService.show('Updated successfully');
            this.loadParents();
          });
        } else {
          this.parentService.create(result).subscribe(() => {
            this.notificationService.show('Created successfully');

            this.loadParents();
          });
        }
      }
    });
  }

  deleteParent(id: number): void {
    this.parentService.delete(id).subscribe(() => {
      this.notificationService.show('Deleted successfully');
      this.loadParents();
    });
  }

  //THIRRE TEK DELETE BUTTON VETEM NESE NESE KERKOHET QE isDeleted te ndryshohet
  softDeleteParent(id: number): void {
    this.parentService.softDelete(id).subscribe(() => {
      this.loadParents();
    });
  }
}
