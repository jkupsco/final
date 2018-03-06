import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      shoppingList: []
    }
  }

  // Retrieve the list of ideas from Airtable
  getShoppingList() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appDRRHVEcAHs85Ok/shoppinglist?&view=Grid%20view";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyMNa19MeObxMQtm'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        shoppingList: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getShoppingList(); // refresh the list when we're done
  }

  // Upvote an idea
  addQty(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appDRRHVEcAHs85Ok/shoppinglist/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyMNa19MeObxMQtm', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          quantity: data.fields.quantity + 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getShoppingList(); // refresh the list when we're done
    });
  }

  // Downvote an idea
  subtractQty(data, secId, rowId, rowMap) {
    // Slide the row back into place
  if (data.fields.quantity>0) {
    rowMap[`${secId}${rowId}`].props.closeRow();


    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appDRRHVEcAHs85Ok/shoppinglist/" + data.id;

    // Needed for Airtable authorization

    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyMNa19MeObxMQtm', // replace with your own API key
        'Content-type': 'application/json'
      }),

        body: JSON.stringify({
          fields: {
            quantity: data.fields.quantity - 1
          }
        })

      };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getShoppingList(); // refresh the list when we're done
    });
  }
  else {
      rowMap[`${secId}${rowId}`].props.closeRow();
  }
}



  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Body>
          <Text>{data.fields.description}</Text>
        </Body>
        <Right>
          <Text note>{data.fields.quantity} qty</Text>
        </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.addQty(data, secId, rowId, rowMap)}>
        <Icon active name="add" />
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.subtractQty(data, secId, rowId, rowMap)}>
        <Icon active name="remove" />
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.shoppingList);
    return (
      <Container>
        <Header>
          <Body>
            <Title>Shopping List</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
