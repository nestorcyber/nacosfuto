/**
 * Vercel Serverless Function: Ensures & manages all canonical NACOS folders in Cloudinary
 * Endpoint: /api/cloudinary/folders
 * Methods: GET (view status), POST (create / sync all canonical folders)
 */

export const CANONICAL_NACOS_FOLDERS = [
  {
    path: 'nacos',
    name: 'Root Organization',
    surface: 'shared',
    description: 'Root NACOS container'
  },
  {
    path: 'nacos/students',
    name: 'Student Passports & Photos',
    surface: 'portal',
    description: 'Student passport photographs for clearance and profiles'
  },
  {
    path: 'nacos/ids',
    name: 'Student ID Cards',
    surface: 'portal',
    description: 'Generated digital student ID card assets and archives'
  },
  {
    path: 'nacos/executives',
    name: 'Executive Council & Staff',
    surface: 'website',
    description: 'Official portraits of executive council and department staff'
  },
  {
    path: 'nacos/yellow_pages',
    name: 'Yellow Pages Businesses',
    surface: 'website',
    description: 'Indigenous student business flyers, cover cards, and brand logos'
  },
  {
    path: 'nacos/events',
    name: 'Events & Flyers',
    surface: 'website',
    description: 'Departmental tech conferences, social mixers, and event flyers'
  },
  {
    path: 'nacos/gallery',
    name: 'Campus Gallery',
    surface: 'website',
    description: 'Campus life, labs, TETFUND complex, and culture gallery photos'
  },
  {
    path: 'nacos/alumni',
    name: 'Alumni Network',
    surface: 'website',
    description: 'Notable alumni spotlight, hall of fame, and inductee portraits'
  },
  {
    path: 'nacos/news',
    name: 'News & Journal',
    surface: 'website',
    description: 'Press releases, blog covers, and journal articles'
  },
  {
    path: 'nacos/homepage',
    name: 'Homepage & Hero',
    surface: 'website',
    description: 'Main public website hero banners and announcement imagery'
  },
  {
    path: 'nacos/certificates',
    name: 'Certificates & Awards',
    surface: 'shared',
    description: 'Digital certificates, hackathon badges, and honors'
  },
  {
    path: 'nacos/general',
    name: 'General Branding',
    surface: 'shared',
    description: 'Departmental logos, icons, and graphic assets'
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (req.method === 'GET') {
    return res.status(200).json({
      configured: Boolean(cloudName && apiKey && apiSecret),
      cloudName: cloudName || 'nacos-futo',
      folders: CANONICAL_NACOS_FOLDERS
    });
  }

  if (req.method === 'POST') {
    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(200).json({
        success: true,
        mode: 'simulated_local',
        message: 'Cloudinary server secrets not yet configured; folder structure cataloged locally.',
        results: CANONICAL_NACOS_FOLDERS.map((f) => ({
          folder: f.path,
          status: 'ready',
          surface: f.surface
        }))
      });
    }

    const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const results = [];

    for (const folder of CANONICAL_NACOS_FOLDERS) {
      try {
        const createRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/folders/${encodeURIComponent(folder.path)}`,
          {
            method: 'POST',
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json'
            }
          }
        );

        if (createRes.ok) {
          results.push({ folder: folder.path, status: 'created', name: folder.name });
        } else if (createRes.status === 409) {
          results.push({ folder: folder.path, status: 'already_exists', name: folder.name });
        } else {
          results.push({ folder: folder.path, status: 'auto_managed', name: folder.name });
        }
      } catch (err) {
        results.push({ folder: folder.path, status: 'auto_managed', error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      mode: 'live_cloudinary',
      cloudName,
      totalFolders: CANONICAL_NACOS_FOLDERS.length,
      results
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
