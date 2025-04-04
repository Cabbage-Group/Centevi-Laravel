import { useState } from "react";
import { Layout, Select, Avatar, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;
const { Option } = Select;

const SearchUsersChat = ({ users, setReceptorId, setReceptorName }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSelect = (userId) => {
        const user = users.find(u => u.id_usuario === userId);
        if (user) {
            setReceptorId(user.id_usuario);
            setReceptorName(user.nombre);
            setSelectedUser(user);
        }
    };

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

            <Select
                showSearch
                placeholder="Buscar usuario..."
                style={{
                    width: 250,
                    borderRadius: "8px",
                    backgroundColor: "#606060",
                    color: "white",
                }}
                dropdownStyle={{ backgroundColor: "#E9EDEF", color: "white" }}
                optionFilterProp="label"
                onSelect={handleSelect}
                filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                }
                suffixIcon={<SearchOutlined style={{ color: "#000000" }} />}
            >
                {users.map(user => (
                    <Option
                        key={user.id_usuario}
                        value={user.id_usuario}
                        label={user.nombre} 
                    >
                        <div className="flex items-center gap-3">
                            <Avatar src={user.foto} size={24}>{!user.foto && user.nombre[0]}</Avatar>
                            <Text style={{ color: "#000000" }}>{user.nombre}</Text>
                        </div>
                    </Option>
                ))}
            </Select>
        </Header>
    );
};

export default SearchUsersChat;
