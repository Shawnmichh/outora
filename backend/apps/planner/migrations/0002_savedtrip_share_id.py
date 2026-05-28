import uuid

from django.db import migrations, models


def populate_share_ids(apps, schema_editor):
    SavedTrip = apps.get_model('planner', 'SavedTrip')
    for trip in SavedTrip.objects.filter(share_id__isnull=True):
        trip.share_id = uuid.uuid4()
        trip.save(update_fields=['share_id'])


class Migration(migrations.Migration):

    dependencies = [
        ('planner', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='savedtrip',
            name='share_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
        migrations.RunPython(populate_share_ids, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='savedtrip',
            name='share_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AddIndex(
            model_name='savedtrip',
            index=models.Index(fields=['share_id'], name='planner_sav_share_i_50b0f7_idx'),
        ),
    ]
