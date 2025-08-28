import { Component, input } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  imports: [],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  role = input.required<string>();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.role);
  }
}
