import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
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
  guageColors: string[] = [ "#f31700", "#ffc000", "#37b400" ];

  goals: Goal[] = [];
  goalTypes: GoalType[] = [];
  goalToType: { [id: string]: string } = {};

  selectedGoalMenu: Goal;
  goalMenu: MenuItem[] = [
    {
      label: 'Edit', icon: 'pi pi-fw pi-pencil',
      command: () => {
        this.editFinancialGoal(this.selectedGoalMenu.Id);
      }
    },
    {
      label: 'Delete', icon: 'pi pi-fw pi-times',
      command: () => {
        this.restApiService.deleteGoal(this.selectedGoalMenu.Id).subscribe(
          (returned: any) => {
            this.getGoals();
          }
        );
      }
    }
  ];

  constructor(private restApiService: RestApiService, 
    private modalController: ModalController) { }

  ngOnInit() {
    this.restApiService.getGoalTypes().subscribe(
      (returnedGoalTypes: GoalType[]) => {
        this.goalTypes = returnedGoalTypes;
        for (let goalType of this.goalTypes) {
          this.goalToType[goalType.Id] = goalType.name;
        }
        this.getGoals();
      }
    );
  }

  getGoals() {
    this.restApiService.getGoals().subscribe(
      (returnedGoals: Goal[]) => {
        this.addStatisticGoalValues(returnedGoals);
        this.goals = returnedGoals;
      }
    );
  }

  addStatisticGoalValues(goals: Goal[]) {
    for (let goal of goals) {
      if (this.goalToType[goal.typeId] == 'Category Budget') {
        goal.values["calendarAwayFromEndDate"] = moment(goal.values['endDate']).calendar();
        let budget = Number(goal.values['budget']);
        goal.values['budget'] = budget;
        let guageColors = [];
        guageColors.push({ from: 0, to: (budget / 3), color: this.guageColors[0] });
        guageColors.push({ from: (budget / 3), to: ((2 * budget) / 3), color: this.guageColors[1] });
        guageColors.push({ from: ((2 * budget) / 3), to: budget, color: this.guageColors[2] });
        goal.values['guageColors'] = guageColors;
        goal.values['currentSpent'] = Number(goal.values['currentSpent']);
        goal.values["availableOfBudget"] = goal.values['budget'] - goal.values['currentSpent'];
        //setInterval(()=>{goal.values["availableOfBudget"]--;}, 1);
      }
      else if (this.goalToType[goal.typeId] == 'Savings') {
        goal.values["calendarAwayFromEndDate"] = moment(goal.values['endDate']).calendar();
      }
    }
  }

  onSelectedGoalMenu(goal: Goal) {
    this.selectedGoalMenu = goal; 
  }

  async addFinancialGoal() {
    const modal = await this.modalController.create({
      component: FinancialGoalWizardModalComponent,
      componentProps: { },
      cssClass: 'modal-container',
      swipeToClose: true
    });
    modal.onDidDismiss().then(
      (data) => {
        this.getGoals();
      }
    );
    return await modal.present();
  }

  async editFinancialGoal(goalId: string) {
    const modal = await this.modalController.create({
      component: FinancialGoalWizardModalComponent,
      componentProps: { goalId: goalId },
      cssClass: 'modal-container',
      swipeToClose: true
    });
    modal.onDidDismiss().then(
      (data) => {
        this.getGoals();
      }
    );
    return await modal.present();
  }

}
