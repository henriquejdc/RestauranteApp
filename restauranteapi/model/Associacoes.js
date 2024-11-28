
import Comanda from "./Comanda.js";
import OrdemProducao from "./OrdemProducao.js";
import ItemCardapio from "./ItemCardapio.js";

Comanda.hasMany(OrdemProducao, { foreignKey: "comanda_id", as: "ordem_producaos" });
OrdemProducao.belongsTo(Comanda, { foreignKey: "comanda_id", as: "comanda" });
OrdemProducao.belongsTo(ItemCardapio, { foreignKey: "item_cardapio_id", as: "item_cardapio" });

export default { Comanda, OrdemProducao, ItemCardapio };
