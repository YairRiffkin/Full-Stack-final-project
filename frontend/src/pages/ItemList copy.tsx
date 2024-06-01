
import { useEffect, useState } from 'react';
import '../components/static/ItemListStyle.css'
import { Item, ItemWithID } from '../models/itemtypes';
import { ItemFormDetails } from '../components/pages/ItemFormDisplayElements';
import { ItemFormDetail } from '../models/formtypes';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type ModalProps = {
  onClose: () => void;
  text: string;
}

const Modal = ({ onClose, text }: ModalProps) => (
  <div className="modal">
    <div className="modal-content">
      <span className="close-button" onClick={onClose}>&times;</span>
      <p>{text}</p>
    </div>
  </div>
);

export function ItemList ({ userToken }: { userToken: string | null }) {
    const [itemDetails, setItemDetails] = useState<ItemWithID[] | null>(null);
    const [comment, setComment] = useState<{id: number, comment: string}[] | null>(null)
    const [modalContent, setModalContent] = useState({ isOpen: false, text: '' });
    const itemFormDetails: ItemFormDetail[] = ItemFormDetails;

    const openModal = (commentText: string) => {
      setModalContent({ isOpen: true, text: commentText });
    };
    const closeModal = () => setModalContent({ isOpen: false, text: '' });

    useEffect(() => {
      fetch(BACKEND_URL + "/items/list", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userToken
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
        })
      .then(data => {            
        if (data && data.item) {
          console.log("DATA: ", data)
          setItemDetails(data.item);
          setComment(data.comment);
        }
      })
      .catch((error) => {
          alert("Error fetching pending data: " + error.message);
        });
      }, [userToken]);

    return (
        <div className="item-list-scroll">
          <table className='custom-table'>
            <thead className='header-row'>
              <tr>
                <th className="fixed-col1">Rem.</th>
                <th className="fixed-col2">SKU</th>
                <th className="fixed-col3">Status</th>
                {itemFormDetails.map((column, index) => (
                    <th key= { index }>{ column.placeholder.en } </th>
                ))}
                
              </tr>
            </thead>
            <tbody>
                {itemDetails && itemDetails.map((row, index) => (
                    <tr key={index} className={`alt-color ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    <td className="fixed-col1">
                      {comment && comment.map((text, index) => {
                        if (text.id === row.id) {
                          return <button 
                                    key={index}
                                    onClick={() => openModal(text.comment)}
                                  >
                                    Rem.
                                  </button>;
                        }
                        return null;
                        })}
                    </td>
                    <td className="fixed-col2">{row.materialNumber}</td>
                    <td className="fixed-col3">{row.status}</td>
                        {itemFormDetails.map((column, columnIndex) => (
                    <td key={columnIndex}>{(row as Item)[column.name as keyof Item]}</td>
                    
                ))}
                
                </tr>
            ))}
            </tbody>
          </table>
          {modalContent.isOpen && <Modal onClose={closeModal} text={modalContent.text} />}
        </div>
      );
    }
