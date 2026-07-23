import { NextRequest, NextResponse } from 'next/server';
import { queryRun, queryAll } from '@/lib/db';
import fs from 'fs';
import os from 'os';

export async function GET(req: NextRequest) {
  const reports: any = {};
  
  // 1. Check current DB Path
  try {
    reports.cwd = process.cwd();
    reports.env = process.env.NODE_ENV;
    
    // Check user info
    try {
      reports.userInfo = os.userInfo();
    } catch (e: any) {
      reports.userInfoError = e.message;
    }
    
    // Check paths
    const vpsDirExists = fs.existsSync('/var/www/summit-outdoor');
    reports.vpsDirExists = vpsDirExists;
    
    const dbPathsToCheck = [
      '/var/www/brain.db',
      '/var/www/summit-outdoor/brain.db',
      './brain.db'
    ];
    
    reports.paths = {};
    for (const p of dbPathsToCheck) {
      const exists = fs.existsSync(p);
      reports.paths[p] = { exists };
      if (exists) {
        try {
          const stat = fs.statSync(p);
          reports.paths[p].mode = stat.mode;
          reports.paths[p].uid = stat.uid;
          reports.paths[p].gid = stat.gid;
          reports.paths[p].size = stat.size;
        } catch (e: any) {
          reports.paths[p].error = e.message;
        }
      }
    }
    
    // Check /var/www directory permissions
    try {
      const wwwStat = fs.statSync('/var/www');
      reports.wwwDir = {
        exists: true,
        uid: wwwStat.uid,
        gid: wwwStat.gid,
        mode: wwwStat.mode
      };
    } catch (e: any) {
      reports.wwwDir = { exists: false, error: e.message };
    }
    
    // 2. Try simple read query
    try {
      const customersCount = await queryAll('SELECT COUNT(*) as count FROM customers');
      reports.readSuccess = true;
      reports.customersCount = customersCount;
    } catch (e: any) {
      reports.readSuccess = false;
      reports.readError = e.message;
    }
    
    // 3. Try test write query
    try {
      const testName = `Test_${Date.now()}`;
      await queryRun(
        'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
        [testName, `${testName}@test.com`, '123456']
      );
      reports.writeSuccess = true;
      
      // Clean it up
      await queryRun('DELETE FROM customers WHERE name = ?', [testName]);
    } catch (e: any) {
      reports.writeSuccess = false;
      reports.writeError = e.message;
    }
    
  } catch (error: any) {
    reports.globalError = error.message;
  }
  
  return NextResponse.json(reports);
}
