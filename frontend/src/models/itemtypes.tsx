import { ItemFormDetails } from "../components/pages/ItemFormDisplayElements"
import { ItemFormDetail } from "./formtypes"

export type Item = {
    materialNumber: string | null
    shortHebrewDescription: string | null
    longHebrewDescription: string | null
    materialType: string | null
    baseUnitOfMeasure: string | null
    oldMaterialNumber: string | null
    materialGroup: string | null
    netWeight: string | null
    orderUnit: string | null
    purchasingGroup: string | null
    manufacturerNumber: string | null
    manufacturerPartNumber: string | null
    plant: string | null
    storageLocation: string | null
    storageBin: string | null
    profitCenter: string | null
    mrpType: string | null
    reorderPoint: string | null
    mrpController: string | null
    maximumStockLevel: string | null
    plannedDeliveryTimeInDays: string | null
    shortEnglishDescription: string | null
    longEnglishDescription: string | null
    supplierNumber: string | null
    supplierName: string | null
    standardPrice: string | null
    currency: string | null
    supplierPartNumber: string | null
    quotationNumber: string | null
    quotationDate: string | null
    status: string | null
    
}

export type ItemContainerType = {
    [key: number]: Item | null;
  };

export type ItemWithID = Item & {
    id: number;
}

export type ItemWithIDandKey = {
    [id: number]: ItemContainerType | null;
}

export const newItem = {
    materialNumber: "",
    shortHebrewDescription: "",
    longHebrewDescription: "",
    materialType: "",
    baseUnitOfMeasure: "",
    oldMaterialNumber: "",
    materialGroup: "",
    netWeight: "",
    orderUnit: "",
    purchasingGroup: "",
    manufacturerNumber: "",
    manufacturerPartNumber: "",
    plant: "",
    storageLocation: "",
    storageBin: "",
    profitCenter: "",
    mrpType: "",
    reorderPoint: "",
    mrpController: "",
    maximumStockLevel: "",
    plannedDeliveryTimeInDays: "",
    shortEnglishDescription: "",
    longEnglishDescription: "",
    supplierNumber: "",
    supplierName: "",
    standardPrice: "",
    currency: "",
    supplierPartNumber: "",
    quotationNumber: "",
    quotationDate: "",
    status: null
    }

export function initializeItem(location: string | null): Item {
    console.log("location: ", location)
    const itemFormDetails: ItemFormDetail[] = ItemFormDetails;
    const initialItem: Item = newItem;
    (Object.keys(initialItem) as (keyof Item)[]).forEach((key) => {
        itemFormDetails.map(( itemDetail ) => {
            if (itemDetail.name === key && itemDetail.options) {
                const defaultValue = itemDetail.options.find( item =>
                    item.description === location
                );
                if (defaultValue) {
                    initialItem[key] = defaultValue.choice
                }
            }
        });
      });
    return initialItem;
}