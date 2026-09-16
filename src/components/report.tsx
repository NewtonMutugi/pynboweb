import {
  Award,
  Calendar,
  Globe,
  MapPin,
  Mic,
  TrendingUp,
  Users,
} from "lucide-react";
import Gallery from "@/components/gallery";
import ScheduleTimeline, {
  type ScheduleDay,
} from "@/components/schedule-timeline";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Statistics = {
  totalAttendees: number;
  speakers: number;
  workshops: number;
  talks: number;
  countries: number;
  companies: number;
  students: number;
  professionals: number;
  distributionByCountry: {
    country: string;
    attendees: number;
    percentage: number;
  }[];
  statisfactionRate: number;
  recommendationRate: number;
  retentionRate: number;
};

type TopicDistribution = {
  topic: string;
  percentage: number;
  count: number;
};

type Props = {
  year: number;
  date: string;
  venue: string;
  schedule: ScheduleDay[];
  statistics: Statistics;
  topicDistribution: TopicDistribution[];
  images: string[];
  achievements?: string[];
  atmosphereTitle?: string;
  atmosphereText?: string;
};

export default function PyConKenyaReport({
  year,
  date,
  venue,
  schedule,
  statistics,
  topicDistribution,
  images,
  achievements,
  atmosphereTitle,
  atmosphereText,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Header */}
      <div className=" shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              PyCon Kenya {year}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Annual Conference Report
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{statistics.totalAttendees} Attendees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
            <TabsTrigger value="overview">Event Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Event Highlights
                </CardTitle>
                <CardDescription>
                  Key achievements and memorable moments from PyCon Kenya {year}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      🎯 Key Achievements
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      {(achievements && achievements.length > 0
                        ? achievements
                        : [
                            `• Largest PyCon Kenya attendance to date with ${statistics.totalAttendees}+ participants`,
                            `• ${statistics.speakers} expert speakers from ${statistics.countries} different countries`,
                            `• ${statistics.workshops} hands-on workshops covering cutting-edge technologies`,
                            `• ${statistics.companies}+ companies represented across various industries`,
                          ]
                      ).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      🌟{" "}
                      {atmosphereTitle ? atmosphereTitle : "Event Atmosphere"}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {atmosphereText
                        ? atmosphereText
                        : "The conference fostered an incredibly collaborative and inclusive environment. Attendees praised the high-quality content, networking opportunities, and the strong sense of community. The event successfully bridged the gap between academia and industry, with meaningful connections formed across all experience levels."}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    📚 Main Topics Covered
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topicDistribution.map((topic) => (
                      <Card key={topic.topic} className="border-l-2">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{topic.topic}</h4>
                            <Badge variant="secondary">
                              {topic.count} sessions
                            </Badge>
                          </div>
                          <Progress value={topic.percentage} className="h-2" />
                          <p className="text-sm text-gray-500 mt-1">
                            {topic.percentage}% of content
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <ScheduleTimeline schedule={schedule} />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Photo Gallery</CardTitle>
                <CardDescription>
                  Capturing the energy, learning, and community spirit of PyCon
                  Kenya {year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Gallery images={images} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {statistics.totalAttendees}
                      </p>
                      <p className="text-sm text-gray-600">Total Attendees</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {statistics.speakers}
                      </p>
                      <p className="text-sm text-gray-600">Expert Speakers</p>
                    </div>
                    <Mic className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {statistics.countries}
                      </p>
                      <p className="text-sm text-gray-600">Countries</p>
                    </div>
                    <Globe className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {statistics.companies}
                      </p>
                      <p className="text-sm text-gray-600">Companies</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendee Demographics</CardTitle>
                  <CardDescription>
                    Breakdown of participant categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Students</span>
                      <span className="text-sm text-gray-500">
                        {statistics.students} (
                        {Math.round(
                          (statistics.students / statistics.totalAttendees) *
                            100,
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={
                        (statistics.students / statistics.totalAttendees) * 100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Professionals</span>
                      <span className="text-sm text-gray-500">
                        {statistics.professionals} (
                        {Math.round(
                          (statistics.professionals /
                            statistics.totalAttendees) *
                            100,
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={
                        (statistics.professionals / statistics.totalAttendees) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Top countries by attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statistics.distributionByCountry.map((item) => (
                      <div
                        key={item.country}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">
                          {item.country}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-12">
                            {item.attendees}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Event Impact & Success Metrics</CardTitle>
                <CardDescription>
                  Measuring the success and impact of PyCon Kenya {year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {statistics.statisfactionRate}%
                    </div>
                    <p className="text-sm text-gray-600">
                      Attendee Satisfaction Rate
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on post-event survey
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {statistics.recommendationRate}%
                    </div>
                    <p className="text-sm text-gray-600">
                      Would Recommend to Others
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Net Promoter Score
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {statistics.retentionRate}%
                    </div>
                    <p className="text-sm text-gray-600">
                      Plan to Attend Next Year
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Retention commitment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
