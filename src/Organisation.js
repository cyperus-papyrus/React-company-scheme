import React, { useCallback, useState, useEffect, useRef } from "react";
import companyData from "./company.json";
import './Organisation.scss';
import avatar from './avatar_empty.jpg';


const Modal = ({ isOpen, setIsOpen, man }) => {
    const handleClose = useCallback(() => { setIsOpen(false); }, [setIsOpen]);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === "Escape" && isOpen) {
                handleClose();
            }
        };
        const handleClickOutside = (event) => {
            if (event.target === modalRef.current) {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleEscapeKey);
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("keydown", handleEscapeKey);
            window.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" ref={modalRef}>
            <div className="modal">
                <div>
                    <img src={avatar} alt={man.name} style={{ width: "100px", height: "100px" }} />
                    <h3>{man.name}</h3>
                    <p>({man.position})</p>
                </div>
                <button onClick={handleClose}>Закрыть</button>
            </div>
        </div>
    );
};

const Employee = ({ employee, level = 0 }) => {
    const [isSubordinatesOpen, setIsSubordinatesOpen] = useState(false);
    const [isSubordinatesModalOpen, setIsSubordinatesModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);
    const handleCloseSubordinatesModal = useCallback(() => setIsSubordinatesModalOpen(false), [setIsSubordinatesModalOpen]);

    const containerClass = isSubordinatesModalOpen ? "employee-container open" : "employee-container";
    return (
        <div className={containerClass}>
            <div key={employee.id} className={"employee-item level-" + level}>
                <div className="employee-inner" onClick={() => setIsModalOpen(true)}>
                    <div className="employee-posiiton">
                        {employee.position ? (
                            <>
                                <div>{employee.position}</div>
                                <div className="employee-name-second">{employee.name}</div>
                            </>
                        ) : (
                            <div>{employee.name}</div>
                        )}
                    </div>
                </div>
                {employee.subordinates && (
                    <>
                        <button className={"rounded level-" + level} onClick={() => setIsSubordinatesModalOpen(true)}>
                            ➜
                        </button>
                        {isSubordinatesOpen && (
                            <OrganizationSheme
                                employees={employee.subordinates}
                                level={level + 1}
                                isOpen={isSubordinatesOpen}
                                setIsOpen={setIsSubordinatesOpen}
                            />
                        )}
                    </>
                )}
            </div>

            <Modal isOpen={isModalOpen} setIsOpen={handleCloseModal} man={employee} />

            {isSubordinatesModalOpen && (
                <div className="subordinates-modal">
                    <OrganizationSheme
                        employees={employee.subordinates}
                        level={level + 1}
                        isOpen={isSubordinatesModalOpen}
                        setIsOpen={setIsSubordinatesModalOpen}
                    />
                    <button className="close" onClick={handleCloseSubordinatesModal}>x</button>
                </div>
            )}
        </div>
    );
};

const OrganizationSheme = ({ employees, level, isOpen, setIsOpen }) => {
    return (
        <div className={"subordinates-container level-" + level}>
            {employees &&
                employees.map((employee) => (
                    <Employee
                        employee={employee}
                        level={level}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        key={employee.id}
                    />
                ))}
        </div>
    );
};

const CEOList = ({ ceo }) => {
    return (
        <div className="ceo-container">
            {ceo.map((c) => (
                <Ceo
                    ceo={c}
                    key={c.id} />
            ))}
        </div>
    );
}

const Ceo = ({ ceo }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div
                className="ceo-item"
                onClick={openModal}
            >
                <span>{ceo.position}</span>
                <span>{ceo.name}</span>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={true}
                    setIsOpen={closeModal}
                    man={ceo}
                />
            )}
        </>
    );
};

const OrganizationStructure = () => {
    return (
        <div>
            <CEOList
                ceo={companyData.company.ceo}
            />
            <OrganizationSheme
                employees={companyData.company.employees}
                level={0}
                isOpen={false}
                setIsOpen={() => { }}
            />
        </div>
    );
};

export default OrganizationStructure;