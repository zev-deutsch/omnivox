import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../models/data.service';
import {GetAnnouncements} from '../../../models/announcements/getAnnouncements';
import {AuthService} from '../../../models/users/auth.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  getannouncements: GetAnnouncements[];

  constructor(private dataService: DataService, private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAnnouncements();
  }

  getAnnouncements(): void {
    this.dataService.getAnnouncements().subscribe((res) => {
      this.getannouncements = [];
      res.map((item) => {
        this.getannouncements.push(new GetAnnouncements(item));
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAnnouncementsDialogComponent,{
      width: '500px'
    });
  }
}

@Component({
  selector: 'app-announcement-add',
  templateUrl: 'announcement-add-dialog.html',
  styleUrls: ['./announcement-add-dialog.scss']
})
export class AddAnnouncementsDialogComponent implements OnInit {

  newAnnouncement: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private dataService: DataService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.newAnnouncement = this.formBuilder.group({
      body: ['', Validators.required]
    });
  }

  get formControls() { return this.newAnnouncement.controls; }


  addAnnouncement() {

    // Set isSubmitted to true
    this.isSubmitted = true;

    // If there are errors don't continue to process form
    if (this.newAnnouncement.invalid) {
      return;
    }
    console.log(this.newAnnouncement.value.body);

    this.dataService.addAnnouncement(this.authService.isLoggedIn.id, this.newAnnouncement.value.body).subscribe(res => console.log(res));

    this.snackBar.open('Announcement added!', '', {
      duration: 2500,
    });
  }
}
