import { inject, injectable } from 'inversify';
import { TYPES } from '../../common/types';
import { Validator } from '../../common/validator';
import { ICommand } from '../../contratcs/commands/command';
import { IZooShopDatabase } from '../../contratcs/data-contract/zooShop-database';
import { IModelsFactory } from '../../contratcs/engine-contracts/factories/models-factory';
import { IPet } from '../../contratcs/pets-contracts/pets/pet';
import { FoodType } from '../../models/enum/food-type';
import { FurType } from '../../models/enum/fur';
import { Sex } from '../../models/enum/sex';
import { DifficultyDegree } from '../../models/enum/train-difficulty';
import { EmployeeCommand } from '../abstract/employee-command';

@injectable()
export class ReceiveCat extends EmployeeCommand implements ICommand {
    private _factory: IModelsFactory;

    constructor(
        @inject(TYPES.zooShopDatabase) data: IZooShopDatabase,
        @inject(TYPES.modelsFactory) factory: IModelsFactory) {
        super(data);
        this._factory = factory;
    }
    public execute(parameters: string[]): string {
        const [breed, price, foodType, sex, furType, trainable, social] = parameters;
        super.execute(parameters);
        if (isNaN(+price) || (social !== 'true' && social !== 'false')) {
            throw new Error('Failed to parse ReceiveCat command parameters.');
        }
        const foodTypeKey: keyof typeof FoodType = <keyof typeof FoodType>foodType;
        const food: FoodType = <FoodType>(FoodType[foodTypeKey]);

        const sexTypeKey: keyof typeof Sex = <keyof typeof Sex>sex;
        const gender: Sex = <Sex>(Sex[sexTypeKey]);
        const furTypeKey: keyof typeof FurType = <keyof typeof FurType>furType;
        const fur: FurType = <FurType>(FurType[furTypeKey]);
        const difficultyDegreeKey: keyof typeof DifficultyDegree = <keyof typeof DifficultyDegree>trainable;
        const degree: DifficultyDegree = <DifficultyDegree>(DifficultyDegree[difficultyDegreeKey]);
        const isSocial: boolean = Boolean(social);

        const cat: IPet = this._factory.receiveCat(breed, +price, food, gender, fur, degree, isSocial);
        this._zooShopDatabase.addPet('cat', cat);

        return Validator.getReceivedMessage('Cat', breed);

    }
}
