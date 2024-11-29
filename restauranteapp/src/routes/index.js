import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  Ionicons  from '@expo/vector-icons/Ionicons'
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Cliente from "../pages/Cliente";
import FecharComanda from "../pages/FecharComanda";
import AdminPanel from "../pages/AdminPanel";
import Mesa from "../pages/Mesa";
import OrdensProducao from "../pages/OrdensProducao";
import ItensCardapio from "../pages/ItensCardapio";
import Relatorio from "../pages/Relatorio";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function RoutesBottom() {
    return (
        <Tab.Navigator
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle:{
                backgroundColor: '#00693E',
            }
        }}
        >
            <Tab.Screen
                name="Inicio"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon:({color, size, focused}) =>{
                        return <Ionicons name='home' size={30} color='#dddddd'/>
                    }

                }}
            />
        </Tab.Navigator>
    );
}

export function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Bem vindo"
                component={Welcome}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={RoutesBottom}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Cliente"
                component={Cliente}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Fechar Comanda"
                component={FecharComanda}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminPanel"
                component={AdminPanel}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Mesa"
                component={Mesa}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ItensCardapio"
                component={ItensCardapio}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrdensProducao"
                component={OrdensProducao}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Relatorio"
                component={Relatorio}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}