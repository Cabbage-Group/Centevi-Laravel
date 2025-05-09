import { useState } from "react";
import { Layout} from "antd";

const { Header } = Layout;

const SearchUsersChat = () => {


    return (
        <Header
            style={{
                padding: "10px 20px",
                marginBottom: "10px",
                borderRadius: "6px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            className="shadow-md"
        >
            <span
                className="font-extrabold text-2xl tracking-wide"
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#202C33",
                    letterSpacing: "1px",
                    marginRight: "20px",
                }}
            >
                Chats
            </span>
        </Header>
    );
};

export default SearchUsersChat;
