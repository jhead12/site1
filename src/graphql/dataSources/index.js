/**
 * Database Models and Data Sources for GraphQL Contract Integration
 * Provides data layer for contracts, users, permissions, and content access
 */

const { DataSource } = require('apollo-datasource');

class ContractDataSource extends DataSource {
  constructor(db) {
    super();
    this.db = db;
  }

  async getContracts(filter = {}) {
    let query = this.db.collection('contracts');
    
    if (filter.status) {
      query = query.where('status', '==', filter.status);
    }
    if (filter.type) {
      query = query.where('type', '==', filter.type);
    }
    if (filter.partnerId) {
      query = query.where('partnerId', '==', filter.partnerId);
    }
    if (filter.ownerId) {
      query = query.where('ownerId', '==', filter.ownerId);
    }
    if (filter.productId) {
      query = query.where('productIds', 'array-contains', filter.productId);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getContract(id) {
    const doc = await this.db.collection('contracts').doc(id).get();
    if (!doc.exists) {
      throw new Error('Contract not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async getContractsByUser(userId) {
    const [ownerContracts, partnerContracts] = await Promise.all([
      this.db.collection('contracts').where('ownerId', '==', userId).get(),
      this.db.collection('contracts').where('partnerId', '==', userId).get()
    ]);
    
    const contracts = [];
    ownerContracts.docs.forEach(doc => {
      contracts.push({ id: doc.id, ...doc.data(), userRole: 'OWNER' });
    });
    partnerContracts.docs.forEach(doc => {
      contracts.push({ id: doc.id, ...doc.data(), userRole: 'PARTNER' });
    });
    
    return contracts;
  }

  async getContractsByProduct(productId) {
    const snapshot = await this.db.collection('contracts')
      .where('productIds', 'array-contains', productId)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createContract(contractData) {
    const contract = {
      ...contractData,
      status: contractData.status || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await this.db.collection('contracts').add(contract);
    return { id: docRef.id, ...contract };
  }

  async updateContract(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.db.collection('contracts').doc(id).update(updateData);
    return this.getContract(id);
  }

  async deleteContract(id) {
    await this.db.collection('contracts').doc(id).delete();
    return true;
  }

  async getContractProducts(contractId) {
    const snapshot = await this.db.collection('contractProducts')
      .where('contractId', '==', contractId)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getContractCountByProduct(productId) {
    const snapshot = await this.db.collection('contracts')
      .where('productIds', 'array-contains', productId)
      .where('status', 'in', ['ACTIVE', 'PENDING'])
      .get();
    
    return snapshot.size;
  }
}

class UserDataSource extends DataSource {
  constructor(db) {
    super();
    this.db = db;
  }

  async getUsers(filter = {}) {
    let query = this.db.collection('users');
    
    if (filter.role) {
      query = query.where('role.name', '==', filter.role);
    }
    if (filter.businessName) {
      query = query.where('businessName', '>=', filter.businessName)
                   .where('businessName', '<=', filter.businessName + '\uf8ff');
    }
    if (filter.hasContracts) {
      // This would need a more complex query or post-processing
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getUser(id) {
    const doc = await this.db.collection('users').doc(id).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async getUserByEmail(email) {
    const snapshot = await this.db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async createUser(userData) {
    const user = {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await this.db.collection('users').add(user);
    return { id: docRef.id, ...user };
  }

  async updateUser(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.db.collection('users').doc(id).update(updateData);
    return this.getUser(id);
  }

  async deleteUser(id) {
    await this.db.collection('users').doc(id).delete();
    return true;
  }

  async getUserRole(roleId) {
    const doc = await this.db.collection('roles').doc(roleId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  async getPartnerRoleId() {
    const snapshot = await this.db.collection('roles')
      .where('name', '==', 'PARTNER')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      throw new Error('Partner role not found');
    }
    
    return snapshot.docs[0].id;
  }
}

class PermissionDataSource extends DataSource {
  constructor(db) {
    super();
    this.db = db;
  }

  async getPermissions() {
    const snapshot = await this.db.collection('permissions').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getPermissionByName(name) {
    const snapshot = await this.db.collection('permissions')
      .where('name', '==', name)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async getUserPermissions(userId) {
    const snapshot = await this.db.collection('userPermissions')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get();
    
    const permissionIds = snapshot.docs.map(doc => doc.data().permissionId);
    
    if (permissionIds.length === 0) {
      return [];
    }
    
    const permissionsSnapshot = await this.db.collection('permissions')
      .where('__name__', 'in', permissionIds)
      .get();
    
    return permissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getContractPermissions(contractId) {
    const snapshot = await this.db.collection('contractPermissions')
      .where('contractId', '==', contractId)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async grantContractPermission(permissionData) {
    const permission = {
      ...permissionData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await this.db.collection('contractPermissions').add(permission);
    return { id: docRef.id, ...permission };
  }

  async revokePermission(userId, permissionId) {
    const snapshot = await this.db.collection('userPermissions')
      .where('userId', '==', userId)
      .where('permissionId', '==', permissionId)
      .get();
    
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isActive: false, revokedAt: new Date().toISOString() });
    });
    
    await batch.commit();
    return true;
  }

  async activateContractPermissions(contractId) {
    const snapshot = await this.db.collection('contractPermissions')
      .where('contractId', '==', contractId)
      .get();
    
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isActive: true, activatedAt: new Date().toISOString() });
    });
    
    await batch.commit();
    return true;
  }

  async revokeContractPermissions(contractId) {
    const snapshot = await this.db.collection('contractPermissions')
      .where('contractId', '==', contractId)
      .get();
    
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isActive: false, revokedAt: new Date().toISOString() });
    });
    
    await batch.commit();
    return true;
  }
}

class ContentDataSource extends DataSource {
  constructor(db) {
    super();
    this.db = db;
  }

  async getUserContentAccess(userId) {
    const snapshot = await this.db.collection('contentAccess')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getContentAccess(contentId, contentType) {
    const snapshot = await this.db.collection('contentAccess')
      .where('contentId', '==', contentId)
      .where('contentType', '==', contentType)
      .where('isActive', '==', true)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async grantContentAccess(accessData) {
    const access = {
      ...accessData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await this.db.collection('contentAccess').add(access);
    return { id: docRef.id, ...access };
  }

  async revokeContentAccess(userId, contentId) {
    const snapshot = await this.db.collection('contentAccess')
      .where('userId', '==', userId)
      .where('contentId', '==', contentId)
      .get();
    
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isActive: false, revokedAt: new Date().toISOString() });
    });
    
    await batch.commit();
    return true;
  }

  async revokeContractContentAccess(contractId) {
    const snapshot = await this.db.collection('contentAccess')
      .where('contractId', '==', contractId)
      .get();
    
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isActive: false, revokedAt: new Date().toISOString() });
    });
    
    await batch.commit();
    return true;
  }
}

class BeatDataSource extends DataSource {
  constructor(db) {
    super();
    this.db = db;
  }

  async getBeats(filter = {}) {
    let query = this.db.collection('beats');
    
    if (filter.artist) {
      query = query.where('artist', '>=', filter.artist)
                   .where('artist', '<=', filter.artist + '\uf8ff');
    }
    if (filter.licenseType) {
      query = query.where('licenseType', '==', filter.licenseType);
    }
    if (filter.availableOnly) {
      query = query.where('availableForLicensing', '==', true);
    }
    if (filter.priceRange) {
      if (filter.priceRange.min) {
        query = query.where('price', '>=', filter.priceRange.min);
      }
      if (filter.priceRange.max) {
        query = query.where('price', '<=', filter.priceRange.max);
      }
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getBeat(id) {
    const doc = await this.db.collection('beats').doc(id).get();
    if (!doc.exists) {
      throw new Error('Beat not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async getAvailableBeats(userId) {
    // Get beats that user has access to through contracts or ownership
    const accessSnapshot = await this.db.collection('contentAccess')
      .where('userId', '==', userId)
      .where('contentType', '==', 'BEAT')
      .where('isActive', '==', true)
      .get();
    
    const beatIds = accessSnapshot.docs.map(doc => doc.data().contentId);
    
    if (beatIds.length === 0) {
      return [];
    }
    
    // Firestore 'in' queries are limited to 10 items, so we may need to batch this
    const beats = [];
    for (let i = 0; i < beatIds.length; i += 10) {
      const batch = beatIds.slice(i, i + 10);
      const beatsSnapshot = await this.db.collection('beats')
        .where('__name__', 'in', batch)
        .get();
      
      beatsSnapshot.docs.forEach(doc => {
        beats.push({ id: doc.id, ...doc.data() });
      });
    }
    
    return beats;
  }

  async createBeat(beatData) {
    const beat = {
      ...beatData,
      availableForLicensing: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await this.db.collection('beats').add(beat);
    return { id: docRef.id, ...beat };
  }

  async updateBeat(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.db.collection('beats').doc(id).update(updateData);
    return this.getBeat(id);
  }
}

module.exports = {
  ContractDataSource,
  UserDataSource,
  PermissionDataSource,
  ContentDataSource,
  BeatDataSource
};
