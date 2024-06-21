import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import PageTitle from "../components/BasicComponents/PageTitle";
import Input from "../components/BasicComponents/Input.tsx";
import Button from "../components/BasicComponents/Button.tsx";
import {useOrders, useSetOrders} from "../providers/OrdersProvider";
import {useProducts} from "../providers/ProductsProvider";
import useLoadDataItem from "../hooks/useLoadDataItem";
import Alert from "../components/BasicComponents/Alert";

const OrderInfo = ({existing}) => {
    const orders = useOrders();
    const setOrders = useSetOrders();
    const products = useProducts();

    let {orderId} = useParams();
    orderId = parseInt(orderId);
    const navigate = useNavigate();

    const [loadDataItem] = useLoadDataItem();
    const [updateDataItem] = useLoadDataItem();

    const [order, setOrder] = useState({
        order_id: null,
        product_name: "",
        product_id: "",
        customer: "",
        volume: 100,
        deadline: "",
        changed: false
    });
    const [exitAlert, setExitAlert] = useState(false);

    const existingOrder = orders.find(order => order.order_id === orderId);
    useEffect(() => {
        if (existing && existingOrder) {
            setOrder(prevState => ({
                ...prevState,
                ...existingOrder,
                product_name: existingOrder.product.name
            }));
        }
    }, [existing, existingOrder, orderId]);

    const uniqueProductsSet = new Set();
    const productNameOptions = products.map((product, index) => {
        if (!uniqueProductsSet.has(product.name)) {
            uniqueProductsSet.add(product.name);
            return <option key={index} value={product.name}>
                {product.name}
            </option>
        } else return null;
    });

    const productTypeOptions = products
        .filter(product => product.name === order.product_name)
        .map((product, index) => (
            <option key={index} value={product.product_id}>
                {product.type}
            </option>
        ));

    const customerList = orders.map((order, index) => (
        <option key={index} value={order.customer}/>
    ));

    const submitHandler = (e) => {
        e.preventDefault();
        if (existing) {
            updateDataItem('orders', order).then(newOrder => {
                const orderIndex = orders.findIndex(orderItem =>
                    orderItem.order_id === order.order_id);
                const newOrders = [...orders];
                newOrders[orderIndex] =
                    {...orders[orderIndex], ...newOrder};
                setOrders(newOrders);
            }).then(() => navigate("/orders/products_to_product"));
        } else {
            loadDataItem('orders', order).then(newOrder => {
                setOrders(prevState => [...prevState, newOrder]);
            }).then(() => navigate("/orders/products_to_product"));
        }
    }

    const backHandler = () => {
        if (order.changed && existing) setExitAlert(true);
        else navigate("/orders/products_to_product");
    }

    return <>
        <PageTitle name={existing ? "Objednávka" : "Nová objednávka"}
                   onBack={backHandler}/>
        <form className={"OrderInfo"} onSubmit={e => submitHandler(e)}>
            <div className={"input-field"}>
                <Input
                    type={"select"}
                    name={"product_name"}
                    value={order.product_name}
                    setter={setOrder}
                    state={order}
                    options={productNameOptions}>
                    Produkt:
                </Input>
                <Input
                    type={"select"}
                    name={"product_id"}
                    value={order.product_id}
                    setter={setOrder}
                    state={order}
                    options={productTypeOptions}>
                    Typ:
                </Input>
                <Input
                    name={"customer"}
                    value={order.customer}
                    setter={setOrder}
                    state={order}
                    list={"customerList"}>
                    Zákazník:
                </Input>
                <datalist id="customerList">
                    {customerList}
                </datalist>
                <Input
                    type={"number"}
                    min={1}
                    name={"volume"}
                    value={order.volume}
                    setter={setOrder}
                    state={order}>
                    Počet:
                </Input>
                <Input
                    name={"deadline"}
                    value={order.deadline}
                    setter={setOrder}
                    state={order}>
                    Konečný termín:
                </Input>
            </div>
            <div className={"bottom-buttons"}>
                {existing
                    ? <><Button>VYMAZAŤ</Button>
                        <Button>ÚPRAVIŤ</Button>
                    </>
                    : <Button>PRIDAŤ</Button>
                }
            </div>
        </form>
        {exitAlert && <Alert
            yesRoute={"/orders/products_to_product"}
            onHide={() => setExitAlert(false)}>
            Pokračovať bez úprav?</Alert>}
    </>
};

export default OrderInfo;