# DPWH Infrastructure Projects Scraper

## Overview

This system scrapes infrastructure project data from all 18 DPWH regions and monitors for changes.

## 🔄 Automated Scheduling (Rate-Limit Friendly)

The system now uses **rotational scraping** to avoid rate limits:

- **Frequency**: 1 region per hour
- **Total regions**: 18 regions
- **Complete cycle**: ~18 hours per full rotation
- **Scheduling**: Runs automatically every hour via Laravel scheduler

### Active Regions:

1. Central Office
2. Cordillera Administrative Region
3. National Capital Region
4. Negros Island Region
5. Region I - XIII (including IV-A and IV-B)

## 📋 Available Commands

### Rotational Scraping (Recommended for Production)

```bash
# Scrape the next region in rotation (used by scheduler)
php artisan dpwh:scrape-next

# View current rotation status
php artisan dpwh:rotation

# Reset rotation to start from first region
php artisan dpwh:rotation --reset
```

### Manual Scraping (For Testing/Development)

```bash
# Scrape all regions at once (not recommended for production due to rate limits)
php artisan dpwh:scrape

# Scrape specific region only
php artisan dpwh:scrape --region="Region I"
php artisan dpwh:scrape --region="National Capital Region"
```

## 🚀 Starting the System

### 1. Start Laravel Scheduler

```bash
php artisan schedule:work
```

### 2. Access Admin Interface

- **Dashboard**: http://dpwh-scraper.test/dashboard
- **Projects**: http://dpwh-scraper.test/projects
- **Changes**: http://dpwh-scraper.test/changes

## 🔍 Monitoring

### View Rotation Status

```bash
php artisan dpwh:rotation
```

Shows:

- Current rotation position (e.g., "3/18")
- Last scraped region
- Next region to be scraped
- Complete list of all 18 regions

### Check Logs

```bash
tail -f storage/logs/laravel.log
```

### Manual Test

```bash
# Test single region scraping
php artisan dpwh:scrape-next
```

## 📊 Database Schema

### Tables:

- **regions** - All 18 DPWH regions with URLs
- **infrastructure_projects** - Project data with change tracking
- **project_changes** - Complete audit trail of all changes

### Change Types:

- `created` - New project discovered
- `updated` - Existing project modified
- `potentially_deleted` - Project missing from website

## ⚡ Benefits of Rotational Scraping

1. **Rate Limit Compliance**: Only 1 request per hour per region
2. **Continuous Monitoring**: All regions covered every 18 hours
3. **Failure Resilience**: Failed regions don't stop the rotation
4. **Resource Efficient**: Lower server load and bandwidth usage
5. **Better Success Rate**: Less likely to trigger anti-bot measures

## 🛠️ Troubleshooting

### If Rotation Gets Stuck:

```bash
php artisan dpwh:rotation --reset
```

### If Website Blocks Requests:

- The rotation will continue automatically
- Failed regions are retried in the next cycle
- Check logs for specific error details

### Manual Override:

```bash
# Skip to specific region manually
php artisan dpwh:scrape --region="Region V"
```

## 📈 Expected Results

When the DPWH website is accessible:

- **18 regions** monitored continuously
- **Complete cycle every 18 hours**
- **Automatic change detection** and database updates
- **Full audit trail** of all modifications
- **Admin interface** for easy monitoring
