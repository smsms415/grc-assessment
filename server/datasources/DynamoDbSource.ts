import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ReturnValue,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class DynamoDataSource {
  private client;

  constructor() {
    this.client = new DynamoDBClient({
      region: "us-east-2",
      // endpoint: "http://localhost:8000",
    });
  }

  async getTopLevelConcepts() {
    const params = {
      TableName: "Concepts",
      FilterExpression: "parentIds = :null",
      ExpressionAttributeValues: marshall({
        ":null": null,
      }),
    };
    try {
      const results = await this.client.send(new ScanCommand(params));
      const concepts = [];
      results.Items.forEach((item) => {
        concepts.push(unmarshall(item));
      });

      return concepts;
    } catch (err) {
      // TODO implement actual error handling
      console.error(err);
      return err;
    }
  }

  async getConceptById(id: Number) {
    const params = {
      TableName: "Concepts",
      Key: {
        conceptId: { N: `${id}` },
        static: { S: "smsms" },
      },
    };

    try {
      const result = await this.client.send(new GetItemCommand(params));
      if (result?.Item) {
        return unmarshall(result.Item);
      }
      return undefined;
    } catch (err) {
      // TODO implement actual error handling
      console.error(err);
      return err;
    }
  }

  async getMaximumConceptId() {
    const params = {
      TableName: "Concepts",
      KeyConditionExpression: "#static = :static",
      ExpressionAttributeNames: { "#static": "static" },
      ExpressionAttributeValues: marshall({ ":static": "smsms" }),
      ScanIndexForward: false,
      Limit: 1,
    };

    try {
      const results = await this.client.send(new QueryCommand(params));

      if (results.Items.length) {
        return unmarshall(results.Items[0]).conceptId;
      }

      return -1;
    } catch (err) {
      // TODO implement actual error handling
      console.error(err);
      return err;
    }
  }

  async createConcept(displayName: String) {
    // first get the max concept ID
    const currentMaximum = await this.getMaximumConceptId();
    const newId = currentMaximum + 1;

    const params = {
      TableName: "Concepts",
      Item: marshall({
        static: "smsms",
        conceptId: newId,
        displayName,
      }),
    };

    try {
      const result = await this.client.send(new PutItemCommand(params));

      return this.getConceptById(newId);
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async updateConceptName(id: Number, displayName: String) {
    const params = {
      TableName: "Concepts",
      Key: {
        conceptId: { N: `${id}` },
        static: { S: "smsms" },
      },
      ReturnValues: "ALL_NEW" as ReturnValue,
      UpdateExpression: "SET #DN = :dn",
      ExpressionAttributeNames: {
        "#DN": "displayName",
      },
      ExpressionAttributeValues: marshall({
        ":dn": displayName,
      }),
    };

    try {
      const result = await this.client.send(new UpdateItemCommand(params));

      return unmarshall(result.Attributes);
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async getAllConcepts() {
    const params = {
      TableName: "Concepts",
      KeyConditionExpression: "#static = :static",
      ExpressionAttributeNames: { "#static": "static" },
      ExpressionAttributeValues: marshall({ ":static": "smsms" }),
      ScanIndexForward: true,
    };
    try {
      const results = await this.client.send(new QueryCommand(params));
      const concepts = [];
      results.Items.forEach((item) => {
        concepts.push(unmarshall(item));
      });

      return concepts;
    } catch (err) {
      // TODO implement actual error handling
      console.error(err);
      return err;
    }
  }

  async deleteConcept(id) {
    const params = {
      TableName: "Concepts",
      Key: marshall({
        conceptId: id,
        static: "smsms",
      }),
    };

    try {
      await this.client.send(new DeleteItemCommand(params));

      return true;
    } catch (err) {
      // TODO implement actual error handling
      console.error(err);
      return false;
    }
  }
}
