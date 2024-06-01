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

// export const newItem = {
//     materialNumber: "",
//     shortHebrewDescription: "ציר Q30 אורך לגיר של פושר אריזה קו חמש 104033191",
//     longHebrewDescription: "ציר Q30 L=226 ממ לגיר של פושר אריזה קו5 ",
//     materialType: "Z104",
//     baseUnitOfMeasure: "PC",
//     oldMaterialNumber: "0",
//     materialGroup: "610",
//     netWeight: "0.001",
//     orderUnit: "PC",
//     purchasingGroup: "E65",
//     manufacturerNumber: "MACDUE",
//     manufacturerPartNumber: "104033191",
//     plant: "4631",
//     storageLocation: "4000",
//     storageBin: "0",
//     profitCenter: "B27912",
//     mrpType: "VB",
//     reorderPoint: "1",
//     mrpController: "Z28",
//     maximumStockLevel: "1",
//     plannedDeliveryTimeInDays: "56",
//     shortEnglishDescription: "104033191 SHAFT MVF 637F (30X226) FOR PUSHER M80",
//     longEnglishDescription: "104033191 SHAFT 30X226 FOR GEAR MVF 637F",
//     supplierNumber: "19105202",
//     supplierName: "MACDUE",
//     standardPrice: "119.54",
//     currency: "EURO",
//     supplierPartNumber: "104033191",
//     quotationNumber: "OR-21362",
//     quotationDate: "06.09.2021",
//     status: null
//     }

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

export function initializeItem(): Item {
    const userDataString = localStorage.getItem("userData");
    const parsedUserDetails = userDataString ? JSON.parse(userDataString) : null;
    const location = parsedUserDetails.location;
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