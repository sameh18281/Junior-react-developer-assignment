import parse from "html-react-parser";
import React from "react";
import { connect } from "react-redux";
import check from "../../assets/check-icn.svg";
import { addToCart } from "../../features/cart/cartSlice";
import { withParams } from "../../utils";
import {
  Attribute,
  AttributeName,
  Attributes,
  Brand,
  Button,
  Container,
  Content,
  Description,
  Header,
  Input,
  Items,
  Label,
  Price,
  PriceData,
  ShowMoreBtn,
  Span,
  SpanSwatch,
  Title
} from "./styles";

class ProductAttributes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      selectedAttributes: [],
    };
  }

  handleShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  handleAddToCart = (product) => {
    const { onSendToCart } = this.props;
    const { selectedAttributes } = this.state;
    const item = { product, selectedAttributes, quantity: 1 };

    const productAttrSize = Object.keys(product.attributes).length;
    const selectedAttrSize = Object.keys(selectedAttributes).length;

    if (productAttrSize !== selectedAttrSize) {
      alert("Please select all attributes");
    } else {
      onSendToCart(item);
      this.props.navigate("/all");
    }
  };

  onChangeValue = (event) => {
    const { name, value } = event.target;

    this.setState({
      selectedAttributes: [
        ...this.state.selectedAttributes,
        {
          id: name,
          value,
        },
      ],
    });
  };

  render() {
    const { product, currency } = this.props;

    return (
      <Container>
        <Header>
          <Brand>{product.brand}</Brand>
          <Title>{product.name}</Title>
        </Header>

        <Attributes>
          {product.attributes &&
            product.attributes.map((attr) => (
              <Attribute key={attr.id}>
                <AttributeName>{attr.name}:</AttributeName>
                <Items onChange={this.onChangeValue}>
                  {attr.items &&
                    attr.items.map((item) => (
                      <div key={`${item.id}`}>
                        <Input
                          type="radio"
                          id={`${attr.name}-${item.id}`}
                          name={attr.id}
                          value={item.value}
                        />
                        {attr.type === "swatch" ? (
                          <Label htmlFor={`${attr.name}-${item.id}`}>
                            <SpanSwatch color={item.value}>
                              <img src={check} alt="Checked Icon" />
                            </SpanSwatch>
                          </Label>
                        ) : (
                          <Label htmlFor={`${attr.name}-${item.id}`}>
                            <Span>{item.displayValue}</Span>
                          </Label>
                        )}
                      </div>
                    ))}
                </Items>
              </Attribute>
            ))}
        </Attributes>

        <PriceData>
          <AttributeName>PRICE:</AttributeName>
          <Price>
            {product.prices ? (
              product.prices.map(
                (price) =>
                  price.currency.label === currency.currency &&
                  `${price.currency.symbol} ${price.amount}`
              )
            ) : (
              <span>Loading</span>
            )}
          </Price>
        </PriceData>

        {product.inStock ? (
          <Button onClick={() => this.handleAddToCart(product)}>
            ADD TO CART
          </Button>
        ) : (
          <Button disabled>OUT OF STOCK</Button>
        )}

        {product.description && (
          <Content>
            {product.description.length > 300 ? (
              this.state.showMore ? (
                <Description>
                  {parse(product.description)}
                  <ShowMoreBtn onClick={this.handleShowMore}>
                    Show Less
                  </ShowMoreBtn>
                </Description>
              ) : (
                <Description>
                  {parse(product.description.slice(0, 300))}
                  <ShowMoreBtn onClick={this.handleShowMore}>
                    Show More
                  </ShowMoreBtn>
                </Description>
              )
            ) : (
              <Description>{parse(product.description)}</Description>
            )}
          </Content>
        )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    currency: state.currency,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSendToCart: (item) => dispatch(addToCart(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withParams(ProductAttributes));
