import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ValidarPermisos from "../../utils/ValidarPermisos";
import { fetchValidarToken, validateUserAuth } from "../../redux/features/auth/AuthSlice";
import getIp from "../../redux/features/utils/getIp";
import { fetchConversations } from "../../redux/features/mensajes/mensajesSlice";

const Sidebar = (props) => {
  const id_usuario = localStorage.getItem("id_usuario");
  const { component } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { usuario, permisos, fetchUsuario } = useSelector((state) => state.auth);

  const [selectPacientes, setSelectPacientes] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const conversationsLength = useSelector((state) => state.chat.conversationsLength);

  console.log("conversationsLength:", conversationsLength);

  useEffect(() => {
    dispatch(fetchConversations(Number(id_usuario)));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token_user");
    if (token) {
      if (!usuario) {
        dispatch(fetchValidarToken(localStorage.getItem("usuario")));
      }
    } else {
      dispatch(validateUserAuth());
      if (!usuario) {
        navigate("/login");
        window.location.replace("/login");
        window.location.reload();
      } else {
        navigate("/home");
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingRoutes(true);
    }, 3000); // 3 segundos

    // Limpieza: limpiar el timeout cuando el componente se desmonte
    return () => clearTimeout(timer);
  }, []);

  useEffect(async () => {
    const IP = await getIp();
  }, []);

  return true == true ? (
    <div className="main-container" id="container">
      <div className="overlay"></div>
      <div className="search-overlay"></div>

      <div className="sidebar-wrapper sidebar-theme">
        <div className="theme-logo">
          <a href="/home">
            <img
              src="../img/centevi.png"
              alt="Logo"
              className="mb-3"
              style={{ maxWidth: 800, display: "block", margin: "0 auto" }}
            />
          </a>
        </div>
        <div className="sidebarCollapseFixed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-arrow-left"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </div>
        <nav id="compactSidebar">
          <ul className="menu-categories ps" style={{ width: "100%" }}>
            <li className="menu-block inicio">
              <a href="/home">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-home"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>{" "}
                INICIO 2.25
              </a>
            </li>

            <li className="menu">
              <a className="menu-toggle" data-active="false" href="#pacientes">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-box"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <span>Pacientes</span>
                </div>
              </a>
            </li>

            <li className="menu">
              <a href="#consultas" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      ></path>
                    </svg>
                  </div>
                  <span>Consultas</span>
                </div>
              </a>
            </li>

            <li className="menu">
              <a href="#sucursales" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-cpu"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                      <rect x="9" y="9" width="6" height="6" />
                      <line x1="9" y1="1" x2="9" y2="4" />
                      <line x1="15" y1="1" x2="15" y2="4" />
                      <line x1="9" y1="20" x2="9" y2="23" />
                      <line x1="15" y1="20" x2="15" y2="23" />
                      <line x1="20" y1="9" x2="23" y2="9" />
                      <line x1="20" y1="14" x2="23" y2="14" />
                      <line x1="1" y1="9" x2="4" y2="9" />
                      <line x1="1" y1="14" x2="4" y2="14" />
                    </svg>
                  </div>
                  <span>Sucursales</span>
                </div>
              </a>
            </li>

            <li className="menu">
              <a href="#recetas" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <span>Recetas</span>
                </div>
              </a>
            </li>

            <li className="menu">
              <a href="#cotizaciones" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 60 60"
                      fill={"#009688"}
                      stroke={"#009688"}
                      className={""}
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <g>
                            <path d="M45.9,11.7v-0.1c-0.1-0.1-0.1-0.2-0.2-0.3l-11-11c-0.1-0.1-0.2-0.1-0.3-0.2h-0.1C34.2,0.1,34.1,0,34,0l0,0H1 C0.4,0,0,0.4,0,1v58c0,0.6,0.4,1,1,1h44c0.6,0,1-0.4,1-1V12l0,0C46,11.9,46,11.8,45.9,11.7z M42.6,11H35V3.4L42.6,11z M2,58V2h31 v10c0,0.6,0.4,1,1,1h10v45H2z" />
                            <path d="M59,38V11c0-0.3-0.1-0.5-0.2-0.7l-2.9-7.6c-0.1-0.3-0.5-0.6-0.9-0.6s-0.8,0.2-0.9,0.6l-2.9,7.6C51.1,10.5,51,10.7,51,11 v27c-0.6,0-1,0.4-1,1v20c0,0.6,0.4,1,1,1h8c0.6,0,1-0.4,1-1V39C60,38.4,59.6,38,59,38z M54.9,5.8l1.6,4.2h-3.1L54.9,5.8z M53,12h4 v26h-1V22h-2v16h-1V12z M52,40h2v18h-2V40z M58,58h-2V40h2V58z" />
                            <polygon points="8,13 10,13 10,10 13,10 13,8 10,8 10,5 8,5 8,8 5,8 5,10 8,10 " />
                            <rect x="16" y="6" width="6" height="2" />
                            <rect x="16" y="10" width="10" height="2" />
                            <rect x="27" y="49" width="14" height="2" />
                            <rect x="27" y="53" width="2" height="2" />
                            <rect x="31" y="53" width="2" height="2" />
                            <rect x="35" y="53" width="2" height="2" />
                            <rect x="39" y="53" width="2" height="2" />
                            <rect x="5" y="18" width="24" height="2" />
                            <rect x="5" y="24" width="36" height="2" />
                            <rect x="5" y="30" width="36" height="2" />
                            <rect x="5" y="36" width="36" height="2" />
                            <rect x="5" y="42" width="36" height="2" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <span>Cotizaciones</span>
                </div>
              </a>
            </li>

            <li className="menu">
              <a href="#reportes" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-box"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <span>Reportes</span>
                </div>
              </a>
            </li>

            {/* {
                ValidarPermisos(
                  "sidebar.usuarios",
                  <li
                    className="menu"
                    onClick={() => {
                      navigate("/usuarios")
                    }}
                  >
                    <Link
                      to="/usuarios"
                      className="menu-toggle"
                      style={{ width: '100%' }}
                    >
                      <div className="base-menu">
                        <div className="base-icons">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                            </path>
                          </svg>
                        </div>
                        <span>Usuarios</span>
                      </div>
                    </Link>
                  </li>
                )
              } */}

            <li className="menu">
              <a href="#tipos-usuarios" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5Z"
                          fill="#1ABC9C"
                        ></path>{" "}
                        <path
                          d="M6.28645 5.9581C6.81559 5.7999 7.1163 5.2427 6.9581 4.71355C6.7999 4.18441 6.2427 3.8837 5.71355 4.0419C4.06991 4.53331 3 6.1924 3 8C3 9.8076 4.06991 11.4667 5.71355 11.9581C6.2427 12.1163 6.7999 11.8156 6.9581 11.2864C7.1163 10.7573 6.81559 10.2001 6.28645 10.0419C5.62978 9.84558 5 9.07911 5 8C5 6.92089 5.62978 6.15442 6.28645 5.9581Z"
                          fill="#1ABC9C"
                        ></path>{" "}
                        <path
                          d="M18.2864 4.0419C17.7573 3.8837 17.2001 4.18441 17.0419 4.71355C16.8837 5.2427 17.1844 5.7999 17.7136 5.9581C18.3702 6.15442 19 6.92089 19 8C19 9.07911 18.3702 9.84558 17.7136 10.0419C17.1844 10.2001 16.8837 10.7573 17.0419 11.2864C17.2001 11.8156 17.7573 12.1163 18.2864 11.9581C19.9301 11.4667 21 9.8076 21 8C21 6.1924 19.9301 4.53331 18.2864 4.0419Z"
                          fill="#1ABC9C"
                        ></path>{" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 14C10.0062 14 8.09544 14.2542 6.64442 14.8986C5.16516 15.5554 4 16.7142 4 18.5C4 18.9667 4.08524 19.4978 4.40272 20.0043C4.72017 20.5106 5.20786 20.8939 5.83781 21.1789C7.04688 21.7259 8.98391 22 12 22C15.0161 22 16.9531 21.7259 18.1622 21.1789C18.7921 20.8939 19.2798 20.5106 19.5973 20.0043C19.9148 19.4978 20 18.9667 20 18.5C20 16.7142 18.8348 15.5554 17.3556 14.8986C15.9046 14.2542 13.9938 14 12 14ZM6 18.5C6 17.7858 6.40184 17.1946 7.45609 16.7264C8.53857 16.2458 10.1278 16 12 16C13.8722 16 15.4614 16.2458 16.5439 16.7264C17.5982 17.1946 18 17.7858 18 18.5C18 18.7236 17.9602 18.8502 17.9027 18.942C17.8452 19.0338 17.7079 19.1893 17.3378 19.3567C16.5469 19.7145 14.9839 20 12 20C9.01609 20 7.45312 19.7145 6.66219 19.3567C6.29214 19.1893 6.15483 19.0338 6.09728 18.942C6.03976 18.8502 6 18.7236 6 18.5Z"
                          fill="#1ABC9C"
                        ></path>{" "}
                        <path
                          d="M19.1042 13.5555C19.3497 13.0608 19.9498 12.8587 20.4445 13.1042C21.9384 13.8456 23 15.1261 23 17C23 17.5523 22.5523 18 22 18C21.4477 18 21 17.5523 21 17C21 16.0458 20.525 15.3769 19.5555 14.8958C19.0608 14.6503 18.8587 14.0502 19.1042 13.5555Z"
                          fill="#1ABC9C"
                        ></path>{" "}
                        <path
                          d="M4.44452 14.8958C4.93924 14.6503 5.14127 14.0502 4.89577 13.5555C4.65027 13.0608 4.0502 12.8587 3.55548 13.1042C2.06158 13.8456 1 15.1261 1 17C1 17.5523 1.44772 18 2 18C2.55228 18 3 17.5523 3 17C3 16.0458 3.47503 15.3769 4.44452 14.8958Z"
                          fill="#1ABC9C"
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                  <span>Adm. Usuarios</span>
                </div>
              </a>
            </li>

            <li className="menu">
              <a href="#ver-kpis" data-active="false" className="menu-toggle">
                <div className="base-menu">
                  <div className="base-icons">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M3 14.6C3 14.0399 3 13.7599 3.10899 13.546C3.20487 13.3578 3.35785 13.2049 3.54601 13.109C3.75992 13 4.03995 13 4.6 13H5.4C5.96005 13 6.24008 13 6.45399 13.109C6.64215 13.2049 6.79513 13.3578 6.89101 13.546C7 13.7599 7 14.0399 7 14.6V19.4C7 19.9601 7 20.2401 6.89101 20.454C6.79513 20.6422 6.64215 20.7951 6.45399 20.891C6.24008 21 5.96005 21 5.4 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V14.6Z"
                          stroke="#1ABC9C"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M10 4.6C10 4.03995 10 3.75992 10.109 3.54601C10.2049 3.35785 10.3578 3.20487 10.546 3.10899C10.7599 3 11.0399 3 11.6 3H12.4C12.9601 3 13.2401 3 13.454 3.10899C13.6422 3.20487 13.7951 3.35785 13.891 3.54601C14 3.75992 14 4.03995 14 4.6V19.4C14 19.9601 14 20.2401 13.891 20.454C13.7951 20.6422 13.6422 20.7951 13.454 20.891C13.2401 21 12.9601 21 12.4 21H11.6C11.0399 21 10.7599 21 10.546 20.891C10.3578 20.7951 10.2049 20.6422 10.109 20.454C10 20.2401 10 19.9601 10 19.4V4.6Z"
                          stroke="#1ABC9C"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M17 10.6C17 10.0399 17 9.75992 17.109 9.54601C17.2049 9.35785 17.3578 9.20487 17.546 9.10899C17.7599 9 18.0399 9 18.6 9H19.4C19.9601 9 20.2401 9 20.454 9.10899C20.6422 9.20487 20.7951 9.35785 20.891 9.54601C21 9.75992 21 10.0399 21 10.6V19.4C21 19.9601 21 20.2401 20.891 20.454C20.7951 20.6422 20.6422 20.7951 20.454 20.891C20.2401 21 19.9601 21 19.4 21H18.6C18.0399 21 17.7599 21 17.546 20.891C17.3578 20.7951 17.2049 20.6422 17.109 20.454C17 20.2401 17 19.9601 17 19.4V10.6Z"
                          stroke="#1ABC9C"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                  <span>Ver Kpis</span>
                </div>
              </a>
            </li>

            {ValidarPermisos(
              "sidebar.agenda",
              <li
                className="menu"
                onClick={() => {
                  navigate("/ver-agenda");
                }}
              >
                {/* <a href="#agenda" data-active="false" className="menu-toggle"> */}
                <Link to="/ver-agenda" className="menu-toggle" style={{ width: "100%" }}>
                  <div className="base-menu">
                    <div className="base-icons">
                      {/*  */}
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M3 9H21M7 3V5M17 3V5M6 12H8M11 12H13M16 12H18M6 15H8M11 15H13M16 15H18M6 18H8M11 18H13M16 18H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                            stroke="#1ABC9C"
                            stroke-width="2"
                            stroke-linecap="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    </div>
                    <span>Agenda</span>
                  </div>
                </Link>
                {/* </a> */}
              </li>
            )}

            {ValidarPermisos(
              "sidebar.chat",
              <li
                className="menu"
                style={{ position: "relative" }}
                onClick={() => {
                  navigate("/ver-socket");
                }}
              >
                {/* <a href="#chat" data-active="false" className="menu-toggle"> */}
                <Link to="/ver-socket" className="menu-toggle" style={{ width: "100%" }}>
                  <div className="base-menu">
                    <div className="base-icons">
                      {/* <WechatTwoTone size={24} color='#1ABC9C' twoToneColor={"#1ABC9C"} /> */}
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M8 9H16"
                            stroke="#1ABC9C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>{" "}
                          <path
                            d="M8 12.5H13.5"
                            stroke="#1ABC9C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>{" "}
                          <path
                            d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712 20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM1.25 10.5C1.25 10.9142 1.58579 11.25 2 11.25C2.41421 11.25 2.75 10.9142 2.75 10.5H1.25ZM3.07351 15.6264C2.915 15.2437 2.47627 15.062 2.09359 15.2205C1.71091 15.379 1.52918 15.8177 1.68769 16.2004L3.07351 15.6264ZM7.78958 18.9915L7.77666 19.7413L7.78958 18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975 18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027 3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279 19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579 20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679 21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957 19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223 17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265 15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955 19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264 17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561 18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75 8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492 7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044 2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223 5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291 3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144 3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621 19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579 20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871 18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501 20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833 20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192 19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z"
                            fill="#1ABC9C"
                          ></path>{" "}
                        </g>
                      </svg>
                    </div>
                    <span>Chat</span>
                  </div>
                </Link>
                {/* </a> */}
                <span
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "#46c60f",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {conversationsLength}
                </span>
              </li>
            )}

            {ValidarPermisos(
              "sidebar.ventas",
              <li
                className="menu"
                onClick={() => {
                  navigate("/ventas");
                }}
              >
                {/* <a href="#agenda" data-active="false" className="menu-toggle"> */}
                <Link to="/ventas" className="menu-toggle" style={{ width: "100%" }}>
                  <div className="base-menu">
                    <div className="base-icons">
                      {/*  */}
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="60"
                          height="60"
                          rx="10"
                          stroke="#1ABC9C"
                          stroke-width="4"
                        />
                        <path
                          d="M20 40L28 32L36 40L44 24"
                          stroke="#1ABC9C"
                          stroke-width="4"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <circle cx="44" cy="24" r="3" fill="#1ABC9C" />
                      </svg>
                    </div>
                    <span>Ventas</span>
                  </div>
                </Link>
                {/* </a> */}
              </li>
            )}

            <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
              <div className="ps__thumb-x" tabIndex="0" style={{ left: 0, width: 0 }}></div>
            </div>
            <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
              <div className="ps__thumb-y" tabIndex="0" style={{ top: 0, height: 0 }}></div>
            </div>
          </ul>
        </nav>

        <div id="compact_submenuSidebar" className="submenu-sidebar ps">
          <div className="submenu" id="pacientes">
            <ul className="submenu-list" data-parent-element="#uiKit">
              {ValidarPermisos(
                "sidebar.pacientes",
                <li>
                  <Link to={"/crear-paciente"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Crear Paciente
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.pacientes",
                <li>
                  <Link to={"/lista-pacientes"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Lista de Pacientes
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="submenu" id="doctores">
            <ul className="submenu-list" data-parent-element="#doctores">
              <li>
                <Link to={"/ver-doctores"}>
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-git-commit"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg>
                  </span>{" "}
                  Ver doctores
                </Link>
              </li>
            </ul>
          </div>

          <div className="submenu" id="consultas">
            <ul className="submenu-list" data-parent-element="#consultas">
              {ValidarPermisos(
                "sidebar.consultas",
                <li>
                  <Link to={"/optometria-neonatos"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Optometría Neonatos
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.consultas",
                <li>
                  <Link to={"/optometria-pediatra"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Optometría Pediátrica
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.consultas",
                <li>
                  <Link to={"/vision-binocular"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ortóptica - Visión Binocular
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.consultas",
                <li>
                  <Link to={"/baja-vision"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Baja Visión
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.consultas",
                <li>
                  <Link to={"/optometria-general"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Optometría General
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.consultas",
                <li>
                  <Link to={"/historia-clinica"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Historia Clínica
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="submenu" id="reportes">
            <ul className="submenu-list" data-parent-elemen t="#reportes">
              {ValidarPermisos(
                "sidebar.reportes.verreportes",
                <li>
                  <Link to={"/reportes"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver Reportes
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.pacientessinatencion",
                <li>
                  <Link to={"/reportes-sin-atencion"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Pacientes sin atención
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.ultimaatencion",
                <li>
                  <Link to={"/reportes-ultima-atencion"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Última atención
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.atendidospordia",
                <li>
                  <Link to={"/paciente-atendido-dia"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Atendidos por día
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.consultasdiarias",
                <li>
                  <Link to={"/consultas-diarias"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>
                    Consultas Diarias
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.terapiasdiarias",
                <li>
                  <Link to={"/terapias-diarias"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>
                    Terapias Diarias
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.proximascitas",
                <li>
                  <Link to={"/proximas-citas"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>
                    Proximas Citas
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.serviciosproximosrealizados",
                <li>
                  <Link to={"/servicios-proximos-realizados"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>
                    Servicios
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.ordenes",
                <li>
                  <Link to={"/reporte-ordenes"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>
                    Ordenes
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.diagnosticos",
                <li>
                  <Link to={"/reporte-diagnosticos"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>
                    Diagnosticos
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.reportes.pacientes",
                <li>
                  <Link to={"/reporte-pacientes"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>
                    Pacientes
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="submenu" id="sucursales">
            <ul className="submenu-list" data-parent-element="#sucursales">
              {ValidarPermisos(
                "sidebar.sucursales",
                <li>
                  <Link to={"/sucursales"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver sucursales
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="submenu" id="recetas">
            <ul className="submenu-list" data-parent-element="#recetas">
              {ValidarPermisos(
                "sidebar.recetas",
                <li>
                  <Link to={"/recetas"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver Recetas
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.recetas.ordenes",
                <li>
                  <Link to={"/ordenes"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver Ordenes
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.recetas.ordenes-labo",
                <li>
                  <Link to={"/ordenes-labo"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ordenes Labo
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.recetas.correcionesordenes",
                <li>
                  <Link to={"/ver-correciones-ordenes"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Correciones Ordenes
                  </Link>
                </li>
              )}
              {ValidarPermisos(
                "sidebar.ordenes.caracteristicas-cristales",
                <li>
                  <Link to={"/caracteristicas-cristales"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Caracteristicas Cristales
                  </Link>
                </li>
              )}
              {ValidarPermisos(
                "sidebar.recetas.servicios",
                <li>
                  <Link to={"/servicios"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Servicios
                  </Link>
                </li>
              )}
              {ValidarPermisos(
                "sidebar.recetas.diagnosticos",
                <li>
                  <Link to={"/diagnosticos"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Diagnosticos
                  </Link>
                </li>
              )}
              {ValidarPermisos(
                "sidebar.ordenes.bases",
                <li>
                  <Link to={"/bases"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Bases
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="submenu" id="cotizaciones">
            <ul className="submenu-list" data-parent-element="#uiKit">
              {ValidarPermisos(
                "sidebar.cotizaciones",
                <li>
                  <Link to="/table-cotizaciones">
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver Cotizaciones
                  </Link>
                </li>
              )}
              {ValidarPermisos(
                "sidebar.cotizaciones",
                <li>
                  <Link to="/table-bodegas">
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver Bodegas
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="submenu" id="idusuarios">
            <ul className="submenu-list" data-parent-element="#uiKit">
              <li>
                <Link to={"/usuarios"}>
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-git-commit"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg>
                  </span>{" "}
                  Ver Usuarios
                </Link>
              </li>
            </ul>
          </div>

          <div className="submenu" id="tipos-usuarios">
            <ul className="submenu-list" data-parent-element="#uiKit">
              {ValidarPermisos(
                "sidebar.tiposusuarios",
                <li>
                  <Link to={"/tipos-usuarios"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver Tipos de Usuarios
                  </Link>
                </li>
              )}

              {ValidarPermisos(
                "sidebar.usuarios",
                <li>
                  <Link to={"/usuarios"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ver Usuarios
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="submenu" id="ver-kpis">
            <ul className="submenu-list" data-parent-element="#uiKit">
              {ValidarPermisos(
                "sidebar.verkpis",
                <li>
                  <Link to={"/ver-kpis"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ordenes
                  </Link>
                </li>
              )}
              {ValidarPermisos(
                "sidebar.verkpis",
                <li>
                  <Link to={"/kpis-tipos-lente"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Ordenes T. Lente
                  </Link>
                </li>
              )}
              {ValidarPermisos(
                "sidebar.verkpis",
                <li>
                  <Link to={"/kpis-consultas-terapias"}>
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-git-commit"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <line x1="1.05" y1="12" x2="7" y2="12" />
                        <line x1="17.01" y1="12" x2="22.96" y2="12" />
                      </svg>
                    </span>{" "}
                    Consultas y Terapias
                  </Link>
                </li>
              )}

              <li>
                <Link to={"/kpis-tipos-cristales"}>
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-git-commit"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg>
                  </span>{" "}
                  Tipos de Cristales
                </Link>
              </li>

              <li>
                <Link to={"/kpis-tipos-bases"}>
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-git-commit"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg>
                  </span>{" "}
                  Tipos Bases
                </Link>
              </li>

              {/* <li>
                  <Link to={"/ver-kpis-consultas-terapias"}>
                    <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                      height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-git-commit">
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg></span> Consultas y Terapias
                  </Link>
                </li> */}

              {/* <li>
                  <Link to={"/ver-kpis-ordenes"}>
                    <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                      height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-git-commit">
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg></span> Ver Kpis Ordenes
                  </Link>
                </li> */}
            </ul>
          </div>

          <div className="submenu" id="agenda">
            <ul className="submenu-list" data-parent-element="#uiKit">
              <li>
                <Link to={"/ver-agenda"}>
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-git-commit"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg>
                  </span>{" "}
                  Ver agenda
                </Link>
              </li>
            </ul>
          </div>

          <div className="submenu" id="chat">
            <ul className="submenu-list" data-parent-element="#uiKit">
              <li>
                <Link to={"/ver-socket"}>
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-git-commit"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <line x1="1.05" y1="12" x2="7" y2="12" />
                      <line x1="17.01" y1="12" x2="22.96" y2="12" />
                    </svg>
                  </span>{" "}
                  Ver Chat
                </Link>
              </li>
            </ul>
          </div>

          <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
            <div className="ps__thumb-x" tabIndex="0" style={{ left: 0, width: 0 }}></div>
          </div>

          <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
            <div className="ps__thumb-y" tabIndex="0" style={{ top: 0, height: 0 }}></div>
          </div>
        </div>
      </div>

      <div id="content" className="main-content">
        <div className="layout-px-spacing">
          <Navbar />
          {/* {
              loadingRoutes ? (
                <Contenido component={component} />
              ) : null
            } */}
          {fetchUsuario ? component : null}
          {/* {component} */}
        </div>
      </div>
      {/*  */}
    </div>
  ) : (
    <div></div>
  );
};

export default Sidebar;
