import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Goal, GoalType } from 'src/app/models/goal';
import { FinancialGoalWizardModalComponent } from 'src/app/reusable-modules/components/financial-goal-wizard-modal/financial-goal-wizard-modal.component';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent implements OnInit {

  guageValue = 88;
  guageColors: any[] = [
    {
      from: 0,
      to: 33,
      color: "#f31700",
    },
    {
      from: 33,
      to: 66,
      color: "#ffc000",
    },
    {
      from: 66,
      to: 100,
      color: "#37b400",
    }
  ];

  goals: Goal[] = [];
  goalTypes: GoalType[] = [];
  goalToType: { [id: string]: string } = {};

  constructor(private restApiService: RestApiService, 
    private modalController: ModalController) { }

  ngOnInit() {
    this.restApiService.getGoalTypes().subscribe(
      (returnedGoalTypes: GoalType[]) => {
        this.goalTypes = returnedGoalTypes;
        for (let goalType of this.goalTypes) {
          this.goalToType[goalType.Id] = goalType.name;
        }
        this.restApiService.getGoals().subscribe(
          (returnedGoals: Goal[]) => {
            this.goals = returnedGoals;
          }
        );
      }
    );
  }

  async addFinancialGoal() {
    const modal = await this.modalController.create({
      component: FinancialGoalWizardModalComponent,
      componentProps: { },
      cssClass: 'modal-container',
      swipeToClose: true
    });
    return await modal.present();
  }

}
