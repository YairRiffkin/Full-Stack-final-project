import { useEffect, useState } from "react";
import '../components/static/pendingstyle.css'
import { DetailsDisplay, ItemDisplayTable, TopDisplay} from "../components/pages/PendingItemHtmlElements";
import { MyResponseContainerType } from "../models/Responsetypes";
import { Item, ItemContainerType } from "../models/itemtypes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


export function PendingItemRequest({ userToken }: { userToken: string | null }) {
    const [selectLoc, setSelectLoc] = useState("");
    const [pendingData, setPendingData] = useState<MyResponseContainerType | null>({});
    const [indexed, setIndexed] = useState<number>(1);
    const [itemDetails, setItemDetails] = useState<ItemContainerType | null>({});
    const [maxItemNumber, setMaxItemNumber] = useState<number>(84500000);
    const [display, setDisplay] = useState<Item | null>(null);
    const [approvalStatus, setApprovalStatus] = useState(false);
    const [comment, setComment] = useState("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    let scrollItem = 1;

    console.log("MAX: ", maxItemNumber)

    useEffect(() => {
      fetch(BACKEND_URL + "/items/pending", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userToken
        },
        body: JSON.stringify({
                              cost_center: selectLoc,
                              Item_ID: pendingData && pendingData[indexed] ? pendingData[indexed]?.relative ?? "" : "",
                              comment: comment
                            }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
        })
      .then(data => {            
        if (data && data.data) {
          console.log("DATA: ", data.item)
          setComment("")
          setPendingData(data.data);
          setItemDetails(data.item)
          if (data.item && data.item[indexed]) {
            setDisplay(data.item[indexed]);
          } else {
            setDisplay(null);
          }
          if (data.maxSKU) {
            console.log(parseInt(data.maxSKU), maxItemNumber)
            setMaxItemNumber(Math.max(parseInt(data.maxSKU), maxItemNumber));
          }
        } 
      })
        .catch((error) => {
          alert("Error fetching pending data: " + error.message);
        });
        if (approvalStatus) {
          setApprovalStatus(false);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [userToken, selectLoc, approvalStatus, isTyping]);

    const handleScroll = () => {
      console.log(maxItemNumber)
      setIndexed((prevIndexed) => {
        const pendingDataLength = pendingData ? Object.keys(pendingData).length : 0;
        if (itemDetails && (prevIndexed < pendingDataLength || prevIndexed > 0)) {
          const nextItem = itemDetails[prevIndexed + scrollItem];
          if (nextItem) {
            setDisplay(nextItem);
            return prevIndexed + scrollItem;
          } else {
            setDisplay(itemDetails[prevIndexed]);
            console.warn('Next item is undefined or null');
            return prevIndexed;
          }
        } else {
          return prevIndexed;
        }
      });
    };

    const handleApprove = () => {
      fetch(BACKEND_URL + "/items/approve", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userToken
        },
        body: JSON.stringify({
                              Item_ID: pendingData && pendingData[indexed] ? pendingData[indexed]?.relative ?? "" : "",
                              SKU: maxItemNumber ? maxItemNumber + 1 : 1
                            }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
        })
      .then(data => {
        if (data && data.data) {
          setMaxItemNumber(prevMaxItemNumber => (typeof prevMaxItemNumber === 'number' ? prevMaxItemNumber + 1 : 1));
          setApprovalStatus(true);
          const pendingDataLength = pendingData ? Object.keys(pendingData).length : 0;
          setIndexed(indexed >= pendingDataLength ? pendingDataLength - 1 : indexed);
          setComment("")
          console.log("data: ", data.data);
          console.log("max SKU:", maxItemNumber)
    }})
          .catch(error => {
            console.error("Error:", error);
          });
        };

      
    return (
      <div className="pending">
        <div className="container">
          <TopDisplay 
            setSelectLoc={setSelectLoc} 
            setMaxItemNumber={setMaxItemNumber} 
            maxItemNumber={maxItemNumber}
          />
          <div className="buttons">
            <button 
              onClick={() => {
                              scrollItem = -1;
                              handleScroll();
                              }}
            >
              Back
            </button>
            <button 
              onClick={() => {
                              scrollItem = 1;
                              handleScroll();
                              }}
            >
              Next
            </button>
            <button
              onClick={() => {
                              handleApprove();
                              }}

            >
              Approve
            </button>
          </div>
          <div className="details-box">
              <DetailsDisplay pendingData={pendingData} indexed={indexed} />
          </div>
              <div className="scroll-box">
                  <ItemDisplayTable display={display}/>
              </div>
              <div className="bottom-text">
                  <textarea
                    value={ comment }
                    onChange={(e) => {  setComment(e.target.value);
                                        setIsTyping(true);
                    }}
                    onBlur={() => { setIsTyping(false);}}
                  ></textarea>
              </div>
          </div>
      </div>
  );
}