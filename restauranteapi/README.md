### Basic Project with NodeJS + Express (PostgreSQL)

**Necessário ter os dados do postgres no .env e o banco restaurantedb criado"

### Run project Api:
```
cd restauranteapi
npm install
npx sequelize-cli db:migrate --config config/config.cjs
node server.js
```

### Documentation
http://localhost:3000/api-docs/#/

### Register and Token
```
Authorization: Bearer token
```
**Doc**: http://localhost:3000/api-docs/#/Autentica%C3%A7%C3%A3o
![Doc Auth](doc-images/image.png)


# Fluxo Admin

- **Verificar itens do cardápio**

    **Doc**: http://localhost:3000/api-docs/#/Itens%20do%20Card%C3%A1pio
    ![Doc item cardápio](doc-images/image-1.png)

- **Verificar mesas**
    **Doc**: http://localhost:3000/api-docs/#/Mesas
    ![Doc mesas](doc-images/image-2.png)

- **Copa ou Cozinha precisam ver as ordens de produção e atualizar**

    **Doc**: http://localhost:3000/api-docs/#/Ordens%20de%20Produção
    ![Doc ordem de produção](doc-images/image-3.png)

- **Ver Comanda**

    **Doc**: http://localhost:3000/api-docs/#/Comandas/get_comandas__id_
    ![Doc ver comanda](doc-images/image-5.png)

- **Ver relatório de vendas**

    **Doc**: http://localhost:3000/api-docs/#/Relatórios
    ![Doc relatório vendas](doc-images/image-4.png)



# Fluxo Cliente

- **Criar comanda**

    **Doc**: http://localhost:3000/api-docs/#/Comandas/post_comandas
    ![Abre comanda](doc-images/image-6.png)

- **Adicionar itens do cardápio a comanda**

    **Doc**: http://localhost:3000/api-docs/#/Comandas/put_comandas__id__adicionar_item
    ![Adiciona item na comanda](doc-images/image-7.png)

- **Fechar comanda**

    **Doc**: http://localhost:3000/api-docs/#/Comandas/put_comandas__id__fechar
    ![Fecha comanda](doc-images/image-8.png)

