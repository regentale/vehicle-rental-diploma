import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILES = {
  users: path.join(DB_DIR, 'users.json'),
  vehicles: path.join(DB_DIR, 'vehicles.json'),
  bookings: path.join(DB_DIR, 'bookings.json'),
  payments: path.join(DB_DIR, 'payments.json'),
  reviews: path.join(DB_DIR, 'reviews.json'),
  favorites: path.join(DB_DIR, 'favorites.json'),
  notifications: path.join(DB_DIR, 'notifications.json'),
  unavailableDates: path.join(DB_DIR, 'unavailable-dates.json'),
};

// Create data directory if it doesn't exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize JSON files if they don't exist
Object.values(DB_FILES).forEach((file) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

class JSONDatabase {
  private readFile(filePath: string): any[] {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private writeFile(filePath: string, data: any[]): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Generic CRUD operations
  findAll(collection: keyof typeof DB_FILES): any[] {
    return this.readFile(DB_FILES[collection]);
  }

  findById(collection: keyof typeof DB_FILES, id: string): any | null {
    const data = this.readFile(DB_FILES[collection]);
    return data.find((item) => item.id === id) || null;
  }

  findOne(collection: keyof typeof DB_FILES, query: any): any | null {
    const data = this.readFile(DB_FILES[collection]);
    return data.find((item) => {
      return Object.keys(query).every((key) => item[key] === query[key]);
    }) || null;
  }

  findMany(collection: keyof typeof DB_FILES, query: any = {}): any[] {
    const data = this.readFile(DB_FILES[collection]);
    if (Object.keys(query).length === 0) return data;
    
    return data.filter((item) => {
      return Object.keys(query).every((key) => {
        if (typeof query[key] === 'object' && query[key] !== null) {
          // Handle nested queries
          return true; // Simplified for now
        }
        return item[key] === query[key];
      });
    });
  }

  create(collection: keyof typeof DB_FILES, data: any): any {
    const items = this.readFile(DB_FILES[collection]);
    const newItem = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.writeFile(DB_FILES[collection], items);
    return newItem;
  }

  update(collection: keyof typeof DB_FILES, id: string, data: any): any | null {
    const items = this.readFile(DB_FILES[collection]);
    const index = items.findIndex((item) => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    this.writeFile(DB_FILES[collection], items);
    return items[index];
  }

  delete(collection: keyof typeof DB_FILES, id: string): boolean {
    const items = this.readFile(DB_FILES[collection]);
    const filteredItems = items.filter((item) => item.id !== id);
    
    if (items.length === filteredItems.length) return false;
    
    this.writeFile(DB_FILES[collection], filteredItems);
    return true;
  }

  deleteMany(collection: keyof typeof DB_FILES, query: any): number {
    const items = this.readFile(DB_FILES[collection]);
    const filteredItems = items.filter((item) => {
      return !Object.keys(query).every((key) => item[key] === query[key]);
    });
    
    const deletedCount = items.length - filteredItems.length;
    this.writeFile(DB_FILES[collection], filteredItems);
    return deletedCount;
  }

  count(collection: keyof typeof DB_FILES, query: any = {}): number {
    return this.findMany(collection, query).length;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Aggregate functions
  aggregate(collection: keyof typeof DB_FILES, field: string, operation: 'sum' | 'avg' | 'min' | 'max'): number {
    const items = this.readFile(DB_FILES[collection]);
    const values = items.map((item) => Number(item[field])).filter((val) => !isNaN(val));
    
    if (values.length === 0) return 0;
    
    switch (operation) {
      case 'sum':
        return values.reduce((acc, val) => acc + val, 0);
      case 'avg':
        return values.reduce((acc, val) => acc + val, 0) / values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      default:
        return 0;
    }
  }
}

export const db = new JSONDatabase();
