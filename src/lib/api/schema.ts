import { z } from "zod";

// Media schemas
const baseMediaSchema = z
  .object({
    id: z.string().optional(),
    caption: z.string().optional(),
    link: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.id !== undefined || data.link !== undefined;
    },
    {
      message: "At least one of id or link must be present",
    }
  );

const documentSchema = z
  .object({
    id: z.string().optional(),
    link: z.string().optional(),
    caption: z.string().optional(),
    filename: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.id !== undefined || data.link !== undefined;
    },
    {
      message: "At least one of id or link must be present",
    }
  );

// Component schemas
const textSchema = z.object({
  body: z.string().min(1, "Body is required"),
});

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  type: z.enum(["HOME", "WORK"]).optional(),
});

const emailSchema = z.object({
  email: z.string().email(),
  type: z.enum(["HOME", "WORK"]).optional(),
});

const nameSchema = z.object({
  formatted_name: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

const orgSchema = z.object({
  company: z.string().optional(),
  department: z.string().optional(),
  title: z.string().optional(),
});

const phoneSchema = z.object({
  phone: z.string(),
  wa_id: z.string().optional(),
  type: z.enum(["HOME", "WORK"]).optional(),
});

const urlSchema = z.object({
  url: z.string().url(),
  type: z.enum(["HOME", "WORK"]).optional(),
});

// Complex component schemas
const contactSchema = z.object({
  addresses: z.array(addressSchema).optional(),
  birthday: z.string().optional(),
  emails: z.array(emailSchema).optional(),
  name: nameSchema,
  org: orgSchema.optional(),
  phones: z.array(phoneSchema).optional(),
  urls: z.array(urlSchema).optional(),
});

const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  name: z.string().optional(),
  address: z.string().optional(),
});

const currencySchema = z.object({
  fallback_value: z.string(),
  code: z.string(),
  amount_1000: z.number(),
});

const dateTimeSchema = z.object({
  fallback_value: z.string(),
  day_of_week: z.number().optional(),
  year: z.number().optional(),
  month: z.number().optional(),
  day_of_month: z.number().optional(),
  hour: z.number().optional(),
  minute: z.number().optional(),
});

// Message type enums
const messageTypeEnum = z.enum([
  "text",
  "image",
  "document",
  "audio",
  "video",
  "sticker",
  "contacts",
  "location",
  "currency",
  "date_time",
  "payload",
  "template",
  "interactive",
] as const);

// Interactive schemas
const interactiveButtonAction = z.object({
  type: z.literal("button"),
  buttons: z.array(
    z.object({
      type: z.enum(["reply"]),
      reply: z.object({
        id: z.string(),
        title: z.string(),
      }),
    })
  ),
});

const interactiveListAction = z.object({
  type: z.literal("list"),
  button: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      rows: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
        })
      ),
    })
  ),
});

// Main message schemas
const internalMessageSchema = z
  .object({
    type: messageTypeEnum,
    text: z.object({ text: textSchema }).optional(),
    image: baseMediaSchema.optional(),
    audio: baseMediaSchema.optional(),
    sticker: baseMediaSchema.optional(),
    video: baseMediaSchema.optional(),
    document: documentSchema.optional(),
    contacts: z.array(contactSchema).optional(),
    location: locationSchema.optional(),
    currency: currencySchema.optional(),
    date_time: dateTimeSchema.optional(),
    payload: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "payload") {
        return data.payload && data.payload.length > 0;
      }
      const type = data.type;
      if (type === "template" || type === "interactive") {
        return true;
      }
      return data[type as keyof typeof data] !== undefined;
    },
    {
      message: "Message must include data matching its type",
    }
  );

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  language: z.object({
    code: z.string().min(1, "Language code is required"),
  }),
  components: z
    .array(
      z.object({
        type: z.enum(["header", "body", "button", "footer"]),
        sub_type: z
          .enum(["quick_reply", "list_reply", "product_list_reply"])
          .optional(),
        index: z.number().optional(),
        parameters: z.array(internalMessageSchema),
      })
    )
    .refine(
      (components) => {
        const singleTypes = ["header", "body", "footer"];
        const hasValidSingleTypes = singleTypes.every(
          (type) => components.filter((c) => c.type === type).length <= 1
        );

        const buttonComponents = components.filter((c) => c.type === "button");
        const hasUniqueIndices =
          new Set(buttonComponents.map((c) => c.index)).size ===
          buttonComponents.length;

        return hasValidSingleTypes && hasUniqueIndices;
      },
      {
        message:
          "Invalid components: Header, body, and footer must appear only once, and button components must have unique indices",
      }
    ),
});

const interactiveSchema = z.object({
  type: z.enum(["button", "list"]),
  header: internalMessageSchema.optional(),
  body: z.object({ text: z.string() }).optional(),
  footer: z.object({ text: z.string() }).optional(),
  action: z.discriminatedUnion("type", [
    interactiveButtonAction,
    interactiveListAction,
  ]),
});

const messageSchema = z
  .object({
    messaging_product: z.string().min(1, "Messaging product is required"),
    recipient_type: z.string().min(1, "Recipient type is required"),
    to: z.string().min(1, "To is required"),
    context: z
      .object({
        message_id: z.string().min(1, "Message ID is required"),
      })
      .optional(),
    type: messageTypeEnum,
    text: z.object({ text: textSchema }).optional(),
    image: baseMediaSchema.optional(),
    audio: baseMediaSchema.optional(),
    sticker: baseMediaSchema.optional(),
    video: baseMediaSchema.optional(),
    document: documentSchema.optional(),
    contacts: z.array(contactSchema).optional(),
    location: locationSchema.optional(),
    template: templateSchema.optional(),
    interactive: interactiveSchema.optional(),
  })
  .refine(
    (data) => {
      const contentFields = [
        "text",
        "image",
        "audio",
        "sticker",
        "video",
        "document",
        "contacts",
        "location",
        "template",
        "interactive",
      ];

      const presentFields = contentFields.filter(
        (field) => data[field as keyof typeof data] !== undefined
      );

      // Ensure exactly one field is present and it matches the type
      return presentFields.length === 1 && presentFields[0] === data.type;
    },
    {
      message:
        "Message must contain exactly one content field matching its type",
    }
  );

export { messageSchema };
