import { SHA256 as sha256 } from "crypto-js";
import { prisma } from "../../../../lib/prisma";
import { text } from "stream/consumers";

// Type definition for the request body
interface CreateUserRequest {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

export default async function handle(req: any, res: any) {
  // Check if method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await createUserHandler(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const hashPassword = (password: string): string | undefined => {
  if (typeof password !== "string" || password.length === 0) {
    console.error("Invalid password:", password);
    return undefined;
  }

  return sha256(password).toString();
};

async function createUserHandler(req: any, res: any) {
  const errors: string[] = [];
  const { firstname, lastname, username, phoneNumber, email, password, address } = req.body as CreateUserRequest;

  // Input validation
  if (!firstname) {
    errors.push("Full name is required");
  }
  if (!lastname) {
    errors.push("Full name is required");
  }
  if (!username) {
    errors.push("Full name is required");
  }

  if (!email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 3) {
    errors.push("Password length should be more than 3 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = hashPassword(password);
    if (!hashedPassword) {
      return res.status(400).json({ error: "Password hashing failed" });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: firstname,
        lastName: lastname,
        username: username,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        address: address,
         // Set default value based on your requirements
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        // Don't return the password
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.error("Database error:", error);
    
    // Check for specific Prisma errors
    if ((error as any).code === 'P2002') {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    return res.status(500).json({ error: "Failed to create user" });
  }
}