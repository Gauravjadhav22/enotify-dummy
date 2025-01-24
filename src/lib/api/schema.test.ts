import { expect, describe, test } from "vitest";
import { messageSchema } from "./schema";
import { z } from "zod";

describe("Message Schema Validation", () => {
  describe("Common Message Fields", () => {
    test("should validate required common fields", () => {
      const validMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "text",
        text: {
          text: {
            body: "Hello",
          },
        },
      };

      const result = messageSchema.parse(validMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(validMessage);
    });

    test("should reject message with missing required fields", () => {
      const incompleteMessage = {
        type: "text",
        text: {
          text: {
            body: "Hello",
          },
        },
      };

      expect(() => messageSchema.parse(incompleteMessage)).toThrow();
    });

    test("should reject message with multiple content types", () => {
      const multipleContentMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "text",
        text: {
          text: {
            body: "Hello",
          },
        },
        image: {
          id: "1234567890",
        },
      };

      expect(() => messageSchema.parse(multipleContentMessage)).toThrow();
    });
  });

  describe("Text Messages", () => {
    test("should validate a valid text message", () => {
      const validTextMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "text",
        text: {
          text: {
            body: "Hello, World!",
          },
        },
      };

      const result = messageSchema.parse(validTextMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(validTextMessage);
    });

    test("should reject text message with empty body", () => {
      const invalidTextMessage: z.infer<typeof messageSchema> = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "text",
        text: {
          text: {
            body: "",
          },
        },
      };

      expect(() => messageSchema.parse(invalidTextMessage)).toThrow();
    });
  });

  describe("Media Messages", () => {
    test("should validate image message with required fields", () => {
      const validImageMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "image",
        image: {
          id: "1234567890",
        },
      };

      const result = messageSchema.parse(validImageMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(validImageMessage);
    });

    test("should validate image message with optional caption", () => {
      const validImageMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "image",
        image: {
          id: "1234567890",
          caption: "Test image",
        },
      };

      const result = messageSchema.parse(validImageMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(validImageMessage);
    });

    test("should reject image message without id", () => {
      const invalidImageMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "image",
        image: {},
      };

      expect(() => messageSchema.parse(invalidImageMessage)).toThrow();
    });
  });

  describe("Contact Messages", () => {
    test("should validate message with minimal contact fields", () => {
      const validContactMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "contacts",
        contacts: [
          {
            name: {
              formatted_name: "John Doe",
            },
          },
        ],
      };

      const result = messageSchema.parse(validContactMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(validContactMessage);
    });

    test("should validate message with all contact fields", () => {
      const fullContactMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "contacts",
        contacts: [
          {
            addresses: [
              {
                street: "123 Main St",
                city: "Springfield",
                state: "IL",
                zip: "62701",
                country: "United States",
                country_code: "US",
                type: "HOME",
              },
            ],
            birthday: "1990-01-01",
            emails: [
              {
                email: "john@example.com",
                type: "WORK",
              },
            ],
            name: {
              formatted_name: "John Doe",
              first_name: "John",
              last_name: "Doe",
              middle_name: "Robert",
              suffix: "Jr",
              prefix: "Mr",
            },
            org: {
              company: "ACME Corp",
              department: "Engineering",
              title: "Senior Engineer",
            },
            phones: [
              {
                phone: "+1234567890",
                type: "WORK",
                wa_id: "1234567890",
              },
            ],
            urls: [
              {
                url: "https://example.com",
                type: "WORK",
              },
            ],
          },
        ],
      };

      const result = messageSchema.parse(fullContactMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(fullContactMessage);
    });

    test("should reject contact message without formatted_name", () => {
      const invalidContactMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "contacts",
        contacts: [
          {
            name: {
              first_name: "John",
              last_name: "Doe",
            },
          },
        ],
      };

      expect(() => messageSchema.parse(invalidContactMessage)).toThrow();
    });

    test("should reject contact message with invalid email", () => {
      const invalidEmailContactMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "contacts",
        contacts: [
          {
            name: {
              formatted_name: "John Doe",
            },
            emails: [
              {
                email: "invalid-email",
                type: "WORK",
              },
            ],
          },
        ],
      };

      expect(() => messageSchema.parse(invalidEmailContactMessage)).toThrow();
    });
  });

  describe("Location Messages", () => {
    test("should validate message with required location fields", () => {
      const validLocationMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "location",
        location: {
          latitude: 37.422,
          longitude: -122.084,
        },
      };

      const result = messageSchema.parse(validLocationMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(validLocationMessage);
    });

    test("should validate location message with optional fields", () => {
      const fullLocationMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "location",
        location: {
          latitude: 37.422,
          longitude: -122.084,
          name: "Googleplex",
          address: "1600 Amphitheatre Parkway, Mountain View, CA",
        },
      };

      const result = messageSchema.parse(fullLocationMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(fullLocationMessage);
    });

    test("should reject location message without latitude", () => {
      const invalidLocationMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "location",
        location: {
          longitude: -122.084,
        },
      };

      expect(() => messageSchema.parse(invalidLocationMessage)).toThrow();
    });

    test("should reject location message without longitude", () => {
      const invalidLocationMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "location",
        location: {
          latitude: 37.422,
        },
      };

      expect(() => messageSchema.parse(invalidLocationMessage)).toThrow();
    });
  });

  describe("Template Messages", () => {
    test("should validate message with minimal template fields", () => {
      const validTemplateMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en",
          },
          components: [],
        },
      };

      const result = messageSchema.parse(validTemplateMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(validTemplateMessage);
    });

    test("should validate template with header, body, and footer components", () => {
      const templateMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "template",
        template: {
          name: "sample_template",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Welcome Header",
                    },
                  },
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Main content",
                    },
                  },
                },
              ],
            },
            {
              type: "footer",
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Footer text",
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      const result = messageSchema.parse(templateMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(templateMessage);
    });

    test("should validate template with button components", () => {
      const templateWithButtons = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "template",
        template: {
          name: "button_template",
          language: {
            code: "en",
          },
          components: [
            {
              type: "button",
              sub_type: "quick_reply",
              index: 0,
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Button 1",
                    },
                  },
                },
              ],
            },
            {
              type: "button",
              sub_type: "quick_reply",
              index: 1,
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Button 2",
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      const result = messageSchema.parse(templateWithButtons);
      expect(result).toBeDefined();
      expect(result).toEqual(templateWithButtons);
    });

    test("should reject template without required name", () => {
      const invalidTemplate = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "template",
        template: {
          language: {
            code: "en",
          },
          components: [],
        },
      };

      expect(() => messageSchema.parse(invalidTemplate)).toThrow();
    });

    test("should reject template with duplicate component types", () => {
      const templateWithDuplicates = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "template",
        template: {
          name: "invalid_template",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Header 1",
                    },
                  },
                },
              ],
            },
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Header 2",
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      expect(() => messageSchema.parse(templateWithDuplicates)).toThrow();
    });

    test("should reject template with duplicate button indices", () => {
      const templateWithDuplicateIndices = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "1234567890",
        type: "template",
        template: {
          name: "invalid_buttons",
          language: {
            code: "en",
          },
          components: [
            {
              type: "button",
              sub_type: "quick_reply",
              index: 0,
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Button 1",
                    },
                  },
                },
              ],
            },
            {
              type: "button",
              sub_type: "quick_reply",
              index: 0,
              parameters: [
                {
                  type: "text",
                  text: {
                    text: {
                      body: "Button 2",
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      expect(() => messageSchema.parse(templateWithDuplicateIndices)).toThrow();
    });
  });
});
