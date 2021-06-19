// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, OnInit, OnChanges, OnDestroy, ViewChild, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { channel, channelgroup } from '../../../models';
import { Subject, Observable } from 'rxjs';
import { AlertService, AccountService, AuthService, AppService, MessageSeverity } from '../../../services';
import { Store } from '@ngrx/store';
import { RootStoreState, ChannelStoreActions, ChannelStoreSelectors } from '../../../store';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-channel-editor',
  templateUrl: './channel-editor.component.html',
  styleUrls: ['./channel-editor.component.scss']
})

export class ChannelEditorComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('form', { static: true })
  private form: NgForm;

  isNewChannel = false;
  private onChannelSaved = new Subject<channel>();
  public isSaving = false;
  @Input() channel: channel;
  @Input() isEditMode: boolean;

  channelForm: FormGroup;
  channelSaved$ = this.onChannelSaved.asObservable();
  isChannelLoaded$: Observable<boolean>;
  nchannelgroup: channelgroup[] = [];

  postedfor: string;
  postedGroups: string[] = ['SILVER MEMBERS', 'GOLD MEMBERS', 'PLATINUM MEMBERS']

  displayedColumns = ['name', 'uniqueid', 'isactive', 'actions'];
  dataSource: MatTableDataSource<channelgroup>;

  get channelFormSection() {
    return this.channelForm.get('channelFormSection');
  }

  get name() {
    return this.channelFormSection.get('name');
  }

  get accountsid() {
    return this.channelFormSection.get('accountsid');
  }
  get membergroup() {
    return this.channelFormSection.get('membergroup');
  }
  

  get authtoken() {
    return this.channelFormSection.get('authtoken');
  }
  get channelgroupsection() {
    return this.channelForm.get('channelgroupsection');
  }
  get groupname() {
    return this.channelgroupsection.get('groupname');
  }
  get uniqueid() {
    return this.channelgroupsection.get('uniqueid');
  }
  get isactive() {
    return this.channelgroupsection.get('isactive');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>
  ) {
    this.dataSource = new MatTableDataSource();
    this.buildForm();
  }

  private buildForm() {
    this.channelForm = this.formBuilder.group({
      channelFormSection: this.formBuilder.group({
        name: ['', Validators.required],
        accountsid: ['', Validators.required],
        authtoken: ['', Validators.required],
        membergroup:['']
      }),
      channelgroupsection: this.formBuilder.group({
        groupname: ['', Validators.required],
        uniqueid: ['', Validators.required],
        isactive: ['', Validators.required]
      })
    })
  }

  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }
  ngOnChanges() {
    if (this.channel) {
      this.isNewChannel = false;
    } else {
      this.isNewChannel = true;
      this.channel = null;
    }

    this.resetForm();
  }
  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.channel) {
      this.isNewChannel = true;
      this.channel = new channel();
    }

    this.channelFormSection.reset({
      name: this.channel.name || '',
      accountsid: this.channel.accountsid || '',
      authtoken: this.channel.authtoken || '',
      membergroup: this.channel.membergroup || ''
    });
  }


  save() {
    if (!this.channelFormSection.valid) {
      this.alertService.showValidationError();
      return;
    }

    if (this.nchannelgroup.length <= 0) {
      this.alertService.showMessage("Channel Group Missing", 'Please add atleast one channel group befoer submitting.', MessageSeverity.error);
      return;
    }
    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');
    const editedChannel = this.getEditedChannel();

    if (this.isNewChannel) {
      this.store$.dispatch(new ChannelStoreActions.AddChannelRequestAction(editedChannel));
      this.isChannelLoaded$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoaded);
      this.isChannelLoaded$.subscribe(result => {
        if (result) {
          this.alertService.showMessage("ADD", "Added channel succesfully", MessageSeverity.success);
        }
      });
    }
    else {
      this.store$.dispatch(new ChannelStoreActions.UpdateChannelRequestAction(editedChannel));
      this.isChannelLoaded$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoaded);
      this.isChannelLoaded$.subscribe(result => {
        if (result) {
          this.alertService.showMessage("UPDATE", "Updated channel succesfully", MessageSeverity.success);
        }
      });
    }
    this.onChannelSaved.next(this.channel);
    this.alertService.stopLoadingMessage();
  }
  private getEditedChannel(): channel {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    const formModel = this.channelFormSection.value;
    let channeledit: channel = new channel();
    channeledit.id = this.isNewChannel ? this.appService.getNewDocId() : this.channel.id;
    channeledit.accountsid = formModel.accountsid;
    channeledit.authtoken = formModel.authtoken;
    channeledit.name = formModel.name;
    channeledit.membergroup = formModel.membergroup;
    channeledit.channelgroup = this.nchannelgroup;
    channeledit.createdon = this.isNewChannel ? new Date(now_utc) : this.channel.createdon;
    channeledit.createdby = this.isNewChannel ? this.authService.currentUser.uid : this.channel.createdby;
    return channeledit;
  }
  updateFlag(ochannelgroup: channelgroup) {
    console.log(ochannelgroup);

  }
  confirmDelete(ochannelgroup: channelgroup) {
    console.log(ochannelgroup);
    var indexOfStevie = this.nchannelgroup.findIndex(i => i.id === ochannelgroup.id);
    if (indexOfStevie > -1) {
      console.log(indexOfStevie);
      this.nchannelgroup.splice(indexOfStevie);
      this.dataSource.data = this.nchannelgroup;
      }
  }
  public addToTable() {
    if (this.channelgroupsection.invalid) {
      this.channelgroupsection.get('groupname').markAsTouched();
      this.channelgroupsection.get('uniqueid').markAsTouched();
      this.channelgroupsection.get('isactive').markAsTouched();
      return;
    }
    //this.TRANS_ELEMENT_DATA = [];
    let ochannelgroup: channelgroup = new channelgroup(
      this.appService.getNewDocId(),
      this.channelgroupsection.get('isactive').value,
      this.channelgroupsection.get('groupname').value,
      this.channelgroupsection.get('uniqueid').value
    );
    this.nchannelgroup.push(ochannelgroup);
    this.channelgroupsection.reset();
    this.dataSource.data = this.nchannelgroup;
  }

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
    if (this.channel.channelgroup && this.channel.channelgroup.length > 0) {
      this.nchannelgroup = [];
      for (var i = 0; i < this.channel.channelgroup.length; i++) {
        let tmpchannelgroup: channelgroup = new channelgroup(
          this.channel.channelgroup[i].id,
          this.channel.channelgroup[i].isactive,
          this.channel.channelgroup[i].name,
          this.channel.channelgroup[i].uniqueid
        );
        this.nchannelgroup.push(tmpchannelgroup);
        this.dataSource.data = this.nchannelgroup;
      }
    }
  }

}
