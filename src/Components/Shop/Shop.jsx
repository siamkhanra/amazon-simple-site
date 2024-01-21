import { useEffect, useState } from 'react';
import './Shop.css'
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, getShoppingCart } from '../../utilities/fakedb';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); // how many items i am taking this quantity

    useEffect( () => {
        fetch('products.json')
        .then(res => res.json())
        .then(data => setProducts(data));
    }, []);

    // To get stored data from local storage and show to site
    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step-1 : get id
        for(const id in storedCart){
            // step-2: get the product from products state by using id
            const addedProduct = products.find(product => product.id === id);
            // step-3: get quantity of the product
            if(addedProduct){
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step-4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
        }
        // step-5: set the cart
        setCart(savedCart);
    }, [products]); // here products is dependency bcz its value changed 

    const handleAddToCart = (product) => {
        // cart.push(product)  /* for javascript */
        let newCart = [];
        // const newCart = [...cart, product];  /* for react */
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd.id === product.id);
        if(!exists){
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else{
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd.id !== product.id);  // filter holo existing bade baki gula k khuje add kora
            newCart = [...remaining, exists];
        }
        setCart(newCart);
        addToDb(product.id);
    }


    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product key={product.id} product={product} handleAddToCart={handleAddToCart}></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Shop;