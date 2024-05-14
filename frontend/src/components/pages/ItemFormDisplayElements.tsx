import { ItemFormDetail } from "../../models/formtypes";

export const LocationList: { description: string | null; choice: string }[] = [
    { description: null,       choice: "--Choose--" },
    { description: "Afula",    choice: "4630" },
    { description: "Nahariya", choice: "4631" },
    { description: "Hadera",   choice: "4632" },
    { description: "Gilboa",   choice: "4643" }
]

export const CostCenterList: { description: string | null; choice: string }[] = [
    { description: null,       choice: "--Choose--" },
    { description: "Afula",    choice: "B27712" },
    { description: "Nahariya", choice: "B27912" },
    { description: "Hadera",   choice: "B27812" },
    { description: "Gilboa",   choice: "B28012" }
]

export const MaterialTypeList: { description: string | null; choice: string }[] = [
    { description: null,                    choice: "--Choose--" },
    { description: "Operating Supplies",    choice: "Z103" },
    { description: "Spare Parts",           choice: "Z104" }
]

export const StorageLocList: { description: string | null; choice: string }[] = [
    { description: null,                    choice: "--Choose--" },
    { description: "Operating Supplies",    choice: "3000" },
    { description: "Spare Parts",           choice: "4000" }
]

export const BaseUnitISOList: { description: string | null; choice: string }[] = [
    { description: null,                choice: "--Choose--" },
    { description: "Pieces",            choice: "PC" },
    { description: "Meter",             choice: "M" },
    { description: "Square meters",     choice: "M2" },
    { description: "Liter",             choice: "L" },
    { description: "Bottles",           choice: "BT" },
    { description: "Cases",             choice: "CS" }
]

export const MRPTypeLIST: { description: string | null; choice: string }[] = [
    { description: null,                    choice: "--Choose--" },
    { description: "Inventory managed",     choice: "VB" },
    { description: "Not inventory managed", choice: "ND" }
]

export const DeliveryTimeList: { description: string | null; choice: string }[] = [
    { description: null,              choice: "--Choose--" },
    { description: "Local Supplier",  choice: "21" },
    { description: "Import Supplier", choice: "56" }
]

export const CurrencyList: { description: string | null; choice: string }[] = [
    { description: null,                choice: "--Choose--" },
    { description: "European Euro",     choice: "Euro" },
    { description: "US Dollar",         choice: "Dollar" },
    { description: "Israeli Sheqel",    choice: "ILS" }
]

export const MaterialGroupListEN: { description: string | null; choice: string }[] = [
    { description: null,                                                  choice: "--Choose--" },
    { description: "Power Transmissions-Accessories",                     choice: "610" },
    { description: "Conveyor Chains|Belts",                               choice: "620" },
    { description: "Bearings",                                            choice: "630" },
    { description: "General Manufacturing Equipment",                     choice: "640" },
    { description: "Heating|Cooling Equipment",                           choice: "650" },
    { description: "Slitters|Knives|Anvils",                              choice: "660" },
    { description: "Doctor'S Knives",                                     choice: "662" },
    { description: "Shafts",                                              choice: "664" },
    { description: "Product Marking Printers",                            choice: "668" },
    { description: "Sewing Machines",                                     choice: "669" },
    { description: "Fasteners|Clamps",                                    choice: "670" },
    { description: "Maintenance Tools",                                   choice: "700" },
    { description: "Industrial Floor Scale",                              choice: "701" },
    { description: "Thermal Insulation",                                  choice: "702" },
    { description: "Lubrication Equipment",                               choice: "750" },
    { description: "Personal Safety Equipment",                           choice: "751" },
    { description: "Welding Equipment And Materials",                     choice: "752" },
    { description: "Personal Safety Clothing",                            choice: "753" },
    { description: "Fire Detection And Extinguishing",                    choice: "756" },
    { description: "Security Systems",                                    choice: "757" },
    { description: "Signaling Devices",                                   choice: "758" },
    { description: "Spare Parts For Lifting Tools",                       choice: "760" },
    { description: "Carts And Transportation Equipment",                  choice: "764" },
    { description: "Equipment For Cleaning And Maintenance",              choice: "770" },
    { description: "Land|Terrain Maintenance Equipment",                  choice: "777" },
    { description: "Different From 770-7770-777",                         choice: "780" },
    { description: "Oils|Chemicals For Maintenance",                      choice: "781" },
    { description: "Fuels And Gas For Vehicles",                          choice: "786" },
    { description: "Chemical For Water - Not For Manufacturing",          choice: "787" },
    { description: "Exception-Group-Catalog EBP",                         choice: "799" },
    { description: "Office Equipment",                                    choice: "800" }
]

export const MaterialGroupListHEB: { description: string | null; choice: string }[] = [
    { description: null,                                                                             choice: "--Choose--" },
    { description: "מעבירי כח-אביזרים",                          choice: "610" },
    { description: "שרשרות|רצועות מסועים",                                 choice: "620" },
    { description: "מיסבים",                                                            choice: "630" },
    { description: "חח ציוד יצרני כללי",                         choice: "640" },
    { description: "ציוד לחימום|קירור",                                choice: "650" },
    { description: "סליטרים|סכינים|סדנים",                                choice: "660" },
    { description: "סכיני דוקטור",                                               choice: "662" },
    { description: "חוטר לטבורים(SHAFTS)",                                                choice: "664" },
    { description: "מדפסות סימון מוצרים",                               choice: "668" },
    { description: "מכונות תפירה",                                               choice: "669" },
    { description: "מחברים|מהדקים",                                             choice: "670" },
    { description: "כלי  אחזקה",                                               choice: "700" },
    { description: "משקל רצפה תעשייתי",                                   choice: "701" },
    { description: "בידוד טרמי",                                              choice: "702" },
    { description: "ציוד סיכה",                                            choice: "750" },
    { description: "ציוד בטיחות אישי",                                 choice: "751" },
    { description: "ציוד וחומרי ריתוך",                          choice: "752" },
    { description: "ביגוד בטיחות אישי",                                 choice: "753" },
    { description: "גילוי וכיבוי אש",                           choice: "756" },
    { description: "מערכות אבטחה",                                              choice: "757" },
    { description: "מכשירי איתות",                                             choice: "758" },
    { description: "חח -כלי הרמה",                                 choice: "760" },
    { description: "עגלות וציוד שינוע",                       choice: "764" },
    { description: "ציוד לנקיון ואחזקה",                  choice: "770" },
    { description: "ציוד אחזקה קרקע|שטח",                     choice: "777" },
    { description: "שונה מ 770-777",                                       choice: "780" },
    { description: "שמנים|כמיקלים לאחזקה",                        choice: "781" },
    { description: "דלקים וגז לרכבים",                 choice: "786" },
    { description: "כימיקל למים-לא ייצור",            choice: "787" },
    { description: "קבוצת-החרגה-מקטלוג-EBP",          choice: "799" },
    { description: "ציוד משרדי",                       choice: "800" }
]


export const ItemFormDetails: ItemFormDetail[] = [
{element: "textarea", type: "text", maxlength: 40, options: null, name: "shortHebrewDescription", placeholder: {en: "Short Hebrew Description", heb: "תיאור עברי מקוצר"}},
{element: "textarea", type: "text", maxlength: 80, options: null, name: "longHebrewDescription", placeholder: {en: "Long Hebrew Description", heb: "תיאור עברי מורחב"}},
{element: "select", type: "text", maxlength: 80, options: MaterialTypeList, name: "materialType", placeholder: {en: "Material Type", heb: "סוג מקט"}},
{element: "select", type: "text", maxlength: 80, options: BaseUnitISOList, name: "baseUnitOfMeasure", placeholder: {en: "Base Unit Of Measure", heb: "יח' מידה בסיסית"}},
{element: "input", type: "text", maxlength: 40, options: null, name: "oldMaterialNumber", placeholder: {en: "Old Material Number", heb: "מקט ישן (חוגלית)"}},
{element: "select", type: "text", maxlength: 80, options: MaterialGroupListEN, name: "materialGroup", placeholder: {en: "Material Group", heb: "קבוצת חומרים"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "netWeight", placeholder: {en: "Net Weight (Kg)", heb: "משקל נטו (קג)"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "orderUnit", placeholder: {en: "Order Unit", heb: "ORDER UNIT"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "purchasingGroup", placeholder: {en: "Purchasing Group", heb: "קבוצת רכש"}},
{element: "input", type: "text", maxlength: 10, options: null, name: "manufacturerNumber", placeholder: {en: "Manufacturer Number", heb: "יצרן"}},
{element: "input", type: "text", maxlength: 40, options: null, name: "manufacturerPartNumber", placeholder: {en: "Manufacturer Part Number", heb: "מס. יצרן"}},
{element: "select", type: "text", maxlength: 80, options: LocationList, name: "plant", placeholder: {en: "Plant", heb: "מפעל"}},
{element: "select", type: "text", maxlength: 80, options: StorageLocList, name: "storageLocation", placeholder: {en: "Storage Location", heb: "אתר אחסון"}},
{element: "input", type: "text", maxlength: 10, options: null, name: "storageBin", placeholder: {en: "Storage Bin", heb: "איתור במחסן"}},
{element: "select", type: "text", maxlength: 80, options: CostCenterList, name: "profitCenter", placeholder: {en: "Profit Center ", heb: "מרכז רווח"}},
{element: "select", type: "text", maxlength: 80, options: MRPTypeLIST, name: "mrpType", placeholder: {en: "Mrp Type", heb: "סוג MRP"}},
{element: "input", type: "text", maxlength: 13, options: null, name: "reorderPoint", placeholder: {en: "Reorder Point", heb: "נק. ה.חוזרת"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "mrpController", placeholder: {en: "Mrp Controller", heb: "בקר MRP"}},
{element: "input", type: "text", maxlength: 13, options: null, name: "maximumStockLevel", placeholder: {en: "Maximum Stock Level", heb: "רמת מלאי מירבית"}},
{element: "select", type: "text", maxlength: 80, options: DeliveryTimeList, name: "plannedDeliveryTimeInDays", placeholder: {en: "Planned Delivery Time In Days ", heb: "ז.אספקה"}},
{element: "textarea", type: "text", maxlength: 40, options: null, name: "shortEnglishDescription", placeholder: {en: "Short English Description", heb: "תיאור אנגלי מקוצר"}},
{element: "textarea", type: "text", maxlength: 80, options: null, name: "longEnglishDescription", placeholder: {en: "Long English Description", heb: "תיאור אנגלי מורחב"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "supplierNumber", placeholder: {en: "Supplier Number", heb: "ספק (מס. במערכת)"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "supplierName", placeholder: {en: "Supplier Name", heb: "שם ספק"}},
{element: "input", type: "text", maxlength: 11, options: null, name: "standardPrice", placeholder: {en: "Standard Price", heb: "מחיר "}},
{element: "select", type: "text", maxlength: 80, options: CurrencyList, name: "currency", placeholder: {en: "Currency", heb: "מטבע"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "supplierPartNumber", placeholder: {en: "Supplier Part Number", heb: "מקט ספק"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "quotationNumber", placeholder: {en: "Quotation Number", heb: "מס. ה.מחיר"}},
{element: "input", type: "text", maxlength: 80, options: null, name: "quotationDate", placeholder: {en: "Quotation Date", heb: "תאריך ה.מחיר"}}
]

export const notRequired = [
    "shortHebrewDescription",
    "longHebrewDescription",
    "oldMaterialNumber",
    "netWeight",
    "storageBin",
]
